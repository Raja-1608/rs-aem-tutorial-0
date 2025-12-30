import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Decorates the main content area.
 * @param {Element} main
 */
function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed for first paint.
 * @param {Document} doc
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  const header = doc.querySelector('header');
  const footer = doc.querySelector('footer');
  const main = doc.querySelector('main');

  await loadHeader(header);
  await loadFooter(footer);

  if (main) {
    decorateMain(main);
    doc.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
}

/**
 * Loads non-critical enhancements.
 * @param {Document} doc
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  if (main) {
    await loadSections(main);
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

/**
 * Loads delayed scripts.
 */
function loadDelayed() {
  window.setTimeout(() => {
    import('./delayed.js');
  }, 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
