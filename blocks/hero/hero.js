/**
 * Hero block customization for Velu Chits.
 * Overrides the hero image using an external URL.
 */
export default function decorate(block) {
  const HERO_URL = 'https://omathisaakthichits.com/img/banner3.png';

  // 1) Try to find a <picture> with sources + img
  const picture = block.querySelector('picture');
  const img = picture ? picture.querySelector('img') : block.querySelector('img');

  // Update <source> elements inside <picture> so the browser can't fall back to the old image
  if (picture) {
    picture.querySelectorAll('source').forEach((source) => {
      source.srcset = HERO_URL;
    });
  }

  // Update <img> itself
  if (img) {
    img.src = HERO_URL;
    img.srcset = HERO_URL;
    if (!img.alt || !img.alt.trim()) {
      img.alt = 'Growth concept jar with plant and coins';
    }
  }

  // 2) Also override any CSS background-image on the hero container, just in case
  const heroContainer = block.closest('.hero, .hero-container, .hero-wrapper');
  if (heroContainer) {
    heroContainer.style.backgroundImage = `url("${HERO_URL}")`;
    heroContainer.style.backgroundSize = 'cover';
    heroContainer.style.backgroundPosition = 'center';
  }
}
