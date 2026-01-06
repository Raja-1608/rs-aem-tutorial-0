/**
 * Minimal Franklin helpers
 * REQUIRED for block decoration
 */

export function decorateMain(main) {
  main.querySelectorAll(':scope > div[class]').forEach((block) => {
    const blockName = block.classList[0];
    block.classList.add('block');
    block.dataset.blockName = blockName;
  });
}

export async function loadBlocks(main) {
  const blocks = [...main.querySelectorAll('.block')];

  await Promise.all(
    blocks.map(async (block) => {
      const name = block.dataset.blockName;

      // Load block CSS
      try {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = `/blocks/${name}/${name}.css`;
        document.head.append(css);
      } catch (e) {}

      // Load block JS
      try {
        const mod = await import(`/blocks/${name}/${name}.js`);
        if (mod.default) mod.default(block);
      } catch (e) {}
    })
  );
}
