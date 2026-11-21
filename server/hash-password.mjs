#!/usr/bin/env node
/**
 * Turn the dashboard password into the value the service checks against.
 *
 *   node server/hash-password.mjs 'the password you chose'            # Node host
 *   node server/hash-password.mjs --worker 'the password you chose'   # Cloudflare Worker
 *
 * or omit the password to type it at the prompt (nothing is echoed):
 *
 *   node server/hash-password.mjs --worker
 *
 * The Node service (`server/index.mjs`) verifies scrypt hashes, printed as
 * `scrypt:<salt>:<hash>`. The Worker (`server/worker.mjs`) verifies PBKDF2
 * hashes, printed as `pbkdf2:<iterations>:<salt>:<hash>`. Copy the printed line
 * into ADMIN_PASSWORD_HASH — the password itself is never stored anywhere.
 *
 * The Worker's iteration count is 100,000 because Cloudflare's production
 * runtime refuses anything above it.
 *
 * You do not need this script for the deployed inbox: with no
 * ADMIN_PASSWORD_HASH set, the dashboard offers a one-time setup screen and
 * stores the hash in D1 instead.
 */
import { pbkdf2Sync, randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const WORKER_ITERATIONS = 100_000;
const args = process.argv.slice(2);
const forWorker = args.includes('--worker');
let password = args.find((argument) => !argument.startsWith('--'));

if (!password) {
  const prompt = createInterface({ input: stdin, output: stdout });
  password = await prompt.question('Password: ');
  prompt.close();
}

if (!password || password.length < 12) {
  console.error('Choose a password of at least 12 characters.');
  process.exit(1);
}

if (forWorker) {
  const salt = randomBytes(16);
  const key = pbkdf2Sync(password, salt, WORKER_ITERATIONS, 32, 'sha256');
  console.log(`pbkdf2:${WORKER_ITERATIONS}:${salt.toString('base64')}:${key.toString('base64')}`);
} else {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  console.log(`scrypt:${salt.toString('hex')}:${key.toString('hex')}`);
}
