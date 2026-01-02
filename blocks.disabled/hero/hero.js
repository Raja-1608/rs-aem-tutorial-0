/**
 * Hero block customization for Velu Chits.
 * Uses the Velar Nidhi banner and updates/creates the heading + image.
 */
export default function decorate(block) {
  const HERO_URL = 'https://valarnidhichits.com/css/images/banner3.jpg';

  // 1) Ensure there is a <picture><img> in the hero
  let picture = block.querySelector('picture');
  let img = picture ? picture.querySelector('img') : block.querySelector('img');

  // If there is no <picture> at all, create one at the top of the block
  if (!picture) {
    picture = document.createElement('picture');
    img = document.createElement('img');
    img.alt = 'Savings growth banner for Velu Chits';
    picture.appendChild(img);
    block.prepend(picture);
  } else if (!img) {
    // If picture exists but no <img>, create it
    img = document.createElement('img');
    img.alt = 'Savings growth banner for Velu Chits';
    picture.appendChild(img);
  }

  // Override <source> tags so the browser can't fall back to old image
  picture.querySelectorAll('source').forEach((source) => {
    // eslint-disable-next-line no-param-reassign
    source.srcset = HERO_URL;
  });

  // Override the <img> itself
  if (img) {
    img.src = HERO_URL;
    img.srcset = HERO_URL;
    if (!img.alt || !img.alt.trim()) {
      img.alt = 'Savings growth banner for Velu Chits';
    }
  }

  // 2) Ensure there is a heading (h1/h2) with your text
  let heading = block.querySelector('h1, h2');
  if (!heading) {
    heading = document.createElement('h1');
    block.appendChild(heading);
  }

  // eslint-disable-next-line no-param-reassign
  heading.textContent = 'Your Smart Savings Journey Starts Here';
}
