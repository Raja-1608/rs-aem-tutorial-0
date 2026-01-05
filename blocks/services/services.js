export default function decorate(block) {
  const rows = [...block.children];

  const titleRow = rows.shift();
  const title = titleRow?.querySelector('h2');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'services-grid';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'service-card';

    [...row.children].forEach((el) => {
      card.append(el);
    });

    cardsWrapper.append(card);
  });

  block.innerHTML = '';
  if (title) block.append(title);
  block.append(cardsWrapper);
}
