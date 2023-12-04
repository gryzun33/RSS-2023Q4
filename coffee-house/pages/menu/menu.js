const burger = document.querySelector('.burger');
const burgerFirst = document.querySelector('.burger span:nth-child(1)');
const burgerSecond = document.querySelector('.burger span:nth-child(2)');
const burgerMenu = document.querySelector('.navigation-menu');
const burgerLinks = document.querySelectorAll('.burger-link');

burger.addEventListener('click', () => {
  console.log('burgerclick');
  toggleBurger();
});

burgerLinks.forEach((burgerLink) => {
  burgerLink.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      toggleBurger();
    }
  });
});

function toggleBurger() {
  burgerFirst.classList.toggle('burger-first');
  burgerSecond.classList.toggle('burger-second');
  burgerMenu.classList.toggle('navigation-menu-show');
  if (burgerMenu.classList.contains('navigation-menu-show')) {
    document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.overflowY = '';
  }
}

// menu
const menuTabs = document.querySelectorAll(`[name='menu']`);
const menuWrapper = document.querySelector('.menu__wrapper');
const loadMoreBtn = document.querySelector('.refresh-btn');
// const modalWrapper = document.querySelector('.modal-wrapper');
let lengthOfMenu = 0;

async function getData(category) {
  const res = await fetch('./products.json');
  const allProducts = await res.json();
  const products = allProducts.filter(
    (prod) => prod.category === `${category}`
  );
  renderMenu(products);
  renderLoadMoreBtn(products.length);
}

// async function getProductData(productName) {
//   const res = await fetch('./products.json');
//   const allProducts = await res.json();
//   const product = allProducts.find((prod) => prod.name === `${productName}`);
//   createModal(modalWrapper, product);
// }

function renderMenu(products) {
  lengthOfMenu = 0;
  const menuList = document.querySelector('.menu__items');
  menuList.innerHTML = '';
  products.forEach((item, i) => {
    const menuItem = document.createElement('li');
    menuItem.classList.add('menu-item');
    if (window.innerWidth < 1090 && i > 3) {
      menuItem.classList.add('hidden');
    }
    menuItem.innerHTML = `
      <div class="menu-item__image-wrapper">
        <img src=${item.image} alt=${item.name}>
      </div>
      <div class="menu-item__description">
        <div class="menu-item__content">
          <h3 class="menu-item__title">${item.name}</h3>
          <p class="menu-item__text">${item.description}</p>
        </div>
        <p class="menu-item__price">$${item.price}</p>
      </div>
    `;
    // menuItem.addEventListener('click', () => {
    //   modalWrapper.classList.remove('modal-hidden');
    //   modalWrapper.classList.add('modal-show');
    //   document.body.style.overflowY = 'hidden';
    //   getProductData(item.name);
    // });
    menuList.append(menuItem);
    lengthOfMenu += 1;
  });
}

function updateMenuView(length) {
  const menuItems = document.querySelectorAll('.menu-item');
  const items = [...menuItems].filter((el, i) => i > 3);
  if (window.innerWidth >= 1090 && length > 4) {
    items.forEach((el) => {
      el.classList.remove('hidden');
    });
  }
  if (window.innerWidth < 1090 && length > 4) {
    items.forEach((el) => {
      el.classList.add('hidden');
    });
  }
}

function renderLoadMoreBtn(length) {
  if (window.innerWidth >= 1090) {
    loadMoreBtn.classList.remove('visible');
    return;
  }
  if (length <= 4) {
    loadMoreBtn.classList.remove('visible');
    return;
  } else {
    loadMoreBtn.classList.add('visible');
  }
}

menuTabs.forEach((input) => {
  input.addEventListener('input', () => {
    getData(input.id);
  });
});

loadMoreBtn.addEventListener('click', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  const hiddenItems = [...menuItems].filter((el, i) => i > 3);
  hiddenItems.forEach((item) => {
    item.classList.remove('hidden');
  });
  loadMoreBtn.classList.remove('visible');
});

getData('coffee');

// resize
let lastWindowWidth = window.innerWidth;
let newWindowWidth;

window.addEventListener('resize', () => {
  newWindowWidth = window.innerWidth;

  if (
    lastWindowWidth <= 768 &&
    newWindowWidth >= 769 &&
    burgerMenu.classList.contains('burger-menu-show')
  ) {
    toggleBurger();
  }

  if (newWindowWidth < 1090 && lastWindowWidth >= 1090) {
    renderLoadMoreBtn(lengthOfMenu);
    updateMenuView(lengthOfMenu);
  }
  if (newWindowWidth >= 1090 && lastWindowWidth < 1090) {
    renderLoadMoreBtn(lengthOfMenu);
    updateMenuView(lengthOfMenu);
  }

  lastWindowWidth = newWindowWidth;
});
