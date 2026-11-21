/**
 * Where the contact form posts.
 *
 * The default is the deployed contact service (Cloudflare Worker + D1). It is
 * a public address, not a secret, and it is the one the live site uses.
 * `PUBLIC_CONTACT_ENDPOINT` overrides it at build time: set it to another URL
 * to point at a self-hosted `server/index.mjs`, or to an empty value to build
 * the form in its "not connected" state, which offers the email address
 * instead and never pretends a message was sent.
 */
const DEPLOYED_ENDPOINT = 'https://next-step-studios-contact-wqep7k.freebuff.site/api/contact';

export const CONTACT_ENDPOINT: string = (
  import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? DEPLOYED_ENDPOINT
).trim();
