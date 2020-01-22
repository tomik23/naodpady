import '../scss/style.scss';

const trashlistJSON = process.env.TRASH_LIST;
const colors = ['brown', 'yellow', 'blue', 'green', 'gray', 'info'];
const trashFullName = [
  'BIO',
  'Metale i tworzywa sztuczne',
  'Papier',
  'Szkło',
  'Zmieszane',
  'RESET',
];

function sortData(data, number) {
  switch (number) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return data
        .filter(a => a.type === number)
        .sort((a, b) => a.name.localeCompare(b.name));
    default:
      return data.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function infoTrash(number) {
  switch (number) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return '<div data-trash="6"><span>RESET</span> wraca do ustawień początkowych</div>';
    default:
      return 'cała lista śmieci';
  }
}

function allsite(number) {
  const numberType = number ? Number(number) : 6;
  const container = document.querySelector('.list__trash');
  const typeTrash = document.querySelector('.type__trash');
  const divBlock = document.createElement('div');
  divBlock.classList.add('container__list');
  container.appendChild(divBlock);

  document.body.classList.add('loading', `color-${colors[numberType - 1]}`);

  fetch(`./trashlist/${trashlistJSON}`)
    .then(response => response.json())
    .then(json => sortData(json.segregacja.odpadow, numberType))
    .then(site => {
      return new Promise(resolve => {
        setTimeout(() => {
          site.map(({ name, type }) => {
            const nameTrash = `
              <div class="gradient__row gradient-${colors[type - 1]}">
                <div class="title">${name}</div>
              </div>`;

            const row = `
              <div class="row">
                ${nameTrash}
              </div>`;

            divBlock.innerHTML += row;
            return divBlock;
          });
          document.body.className = '';
          resolve();
        }, 500);
      });
    });

  typeTrash.innerHTML = infoTrash(numberType);
  tilesWithContainerNames();
}

function scrollTopWindow() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function searchText() {
  const input = document.getElementById('search');
  const filter = input.value.toUpperCase();
  const content = document.querySelector('.container__list');
  const lists = content.querySelectorAll('.title');

  for (let i = 0; i < lists.length; i++) {
    const item = lists[i].textContent;
    if (item.toUpperCase().indexOf(filter) > -1) {
      lists[i].parentNode.parentNode.style.display = '';
    } else {
      lists[i].parentNode.parentNode.style.display = 'none';
    }
  }
  scrollTopWindow();
}

function downloadDataByColor() {
  const dataTrashs = document.querySelectorAll('[data-trash]');
  const footer = document.querySelector('.color-of__containers');
  const content = document.querySelector('.container__list');

  dataTrashs.forEach(dataTrash => {
    dataTrash.addEventListener('click', () => {
      footer.innerHTML = '';
      content.remove();
      const dataType = dataTrash.dataset.trash;
      allsite(dataType);
    });
  });
}

function tilesWithContainerNames() {
  const footer = document.querySelector('.color-of__containers');

  colors.forEach((color, index) => {
    const colorElement = colors[index];
    const column = `
      <div class="color__trash ${colorElement}" data-trash="${index + 1}">${
      trashFullName[index]
    }</div>
    `;
    footer.innerHTML += column;
  });
  downloadDataByColor();
}

function navigationMenu() {
  const toggler = document.querySelector('.menu__toggler');
  const menu = document.querySelector('.menu');

  toggler.addEventListener('click', () => {
    toggler.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.classList.toggle('active-menu');
  });
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
window.addEventListener('input', searchText);
window.addEventListener('DOMContentLoaded', () => {
  allsite();
  navigationMenu();
});
