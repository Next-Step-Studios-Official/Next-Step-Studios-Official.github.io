#!/usr/bin/env node
/**
 * Turn the dashboard password into the value the server checks against.
 *
 *   node server/hash-password.mjs 'the password you chose'
 *
 * or omit the argument and type it at the prompt (nothing is echoed):
 *
 *   node server/hash-password.mjs
 *
 * Copy the printed `scrypt:...:...` line into ADMIN_PASSWORD_HASH. Only the
 * hash is stored in the environment; the password itself never is.
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

let password = process.argv[2];

if (!password) {
  const prompt = createInterface({ input: stdin, output: stdout });
  password = await prompt.question('Password: ');
  prompt.close();
}

if (!password || password.length < 12) {
  console.error('Choose a password of at least 12 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 64);
console.log(`scrypt:${salt.toString('hex')}:${key.toString('hex')}`);
