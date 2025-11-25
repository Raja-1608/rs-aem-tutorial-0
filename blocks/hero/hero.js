/**
 * Hero block customization for Velu Chits.
 * Uses the Velar Nidhi banner and updates the heading text.
 */
export default function decorate(block) {
  const HERO_URL = 'https://valarnidhichits.com/css/images/banner3.jpg';

  // Find picture/img in the hero
  const picture = block.querySelector('picture');
  const img = picture ? picture.querySelector('img') : block.querySelector('img');

  // Override <source> tags so the browser can't fall back to the old image
  if (picture) {
    picture.querySelectorAll('source').forEach((source) => {
      // eslint-disable-next-line no-param-reassign
      source.srcset = HERO_URL;
    });
  }

  // Override the <img> itself
  if (img) {
    img.src = HERO_URL;
    img.srcset = HERO_URL;
    if (!img.alt || !img.alt.trim()) {
      img.alt = 'Savings growth banner for Velu Chits';
    }
  }

  // Update the hero heading text
  const heading = block.querySelector('h1, h2');
  if (heading) {
    // eslint-disable-next-line no-param-reassign
    heading.textContent = 'Your Smart Savings Journey Starts Here';
  }
}
