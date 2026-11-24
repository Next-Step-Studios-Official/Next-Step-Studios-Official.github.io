export const SITE = {
  name: 'Next Step Studios',
  operator: 'Candler Shaw',
  /**
   * The site's canonical address. It is projected from the GitHub Pages
   * deployment the site is built for; the deploy workflow overrides it with
   * `SITE_URL` so the real repository address wins.
   */
  url: 'https://next-step-studios-official.github.io',
  /**
   * The only public contact route. Update here and it changes everywhere:
   * the contact page, the footer and the policy pages read this value.
   * This address is documented as temporary — replace it if a
   * domain-based address is set up.
   */
  contactEmail: 'nextstepstudiosofficial.contact@gmail.com',
  /**
   * Exact attribution for original studio-created work. Used in the footer,
   * generated documents and the Places Left Behind project page. Do not apply
   * this to third-party material or community-created work.
   */
  copyright:
    'Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.',
  /** The public mirror of the policy documents. */
  docsRepoUrl: 'https://github.com/Next-Step-Studios-Official/bot-documentation',
} as const;
