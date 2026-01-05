import { decorateMain, loadBlocks } from './lib-franklin.js';

function init() {
  const main = document.querySelector('main');
  if (!main) return;

  decorateMain(main);
  loadBlocks(main);
}

init();
