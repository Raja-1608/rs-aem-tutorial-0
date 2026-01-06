import { decorateMain, loadBlocks } from './lib-franklin.js';

async function loadFragment(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(path);
  el.innerHTML = await res.text();
}

async function init() {
  await loadFragment('.site-header', '/nav.plain.html');
  await loadFragment('.site-footer', '/footer.plain.html');

  const main = document.querySelector('main');
  decorateMain(main);
  loadBlocks(main);
}

init();
