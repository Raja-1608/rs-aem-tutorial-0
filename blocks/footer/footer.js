import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer using the /footer fragment.
 * The fragment HTML lives in /footer.plain.html at the repo root.
 */
export default async function decorate(block) {
  // Read <meta name="footer" content="/footer"> if present, otherwise default to /footer
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  // Clear the block and inject fragment content
  block.textContent = '';
  while (fragment.firstElementChild) {
    block.append(fragment.firstElementChild);
  }

  // Make sure external social links are safe
  const socialLinks = block.querySelectorAll('.footer-social a[target="_blank"]');
  socialLinks.forEach((link) => {
    if (!link.rel || !link.rel.includes('noopener')) {
      // eslint-disable-next-line no-param-reassign
      link.rel = 'noopener noreferrer';
    }
  });
}
