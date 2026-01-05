export default function decorate(block) {
  const rows = [...block.children];
  const titleRow = rows.shift();

  const title = titleRow?.textContent;
  const grid = document.createElement('div');
  grid.className = 'services-grid';

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.append(cell);
      grid.append(card);
    });
  });

  block.innerHTML = `<h2>${title}</h2>`;
  block.append(grid);
}
