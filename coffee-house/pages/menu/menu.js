// burger
const burger = document.querySelector('.burger');
const burgerFirst = document.querySelector('.burger span:nth-child(1)');
const burgerSecond = document.querySelector('.burger span:nth-child(2)');
const burgerMenu = document.querySelector('.navigation-menu');
const burgerLinks = document.querySelectorAll('.burger-link');

burger.addEventListener('click', () => {
  // console.log('burgerclick');
  window.scrollTo(0, 0);
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
const modalWrapper = document.querySelector('.modal-wrapper');
const menuList = document.querySelector('.menu__items');
let lengthOfMenu = 0;
let firstTime = true;

async function getData(category) {
  const res = await fetch('./products.json');
  const allProducts = await res.json();
  const products = allProducts.filter(
    (prod) => prod.category === `${category}`
  );

  if (firstTime) {
    firstTime = false;
    renderMenu(products);
  } else {
    console.log(category);
    console.log('firsttime false');
    menuList.classList.add('menu-hide');
    menuList.addEventListener('animationend', renderAfterAniamtion);

    function renderAfterAniamtion(e) {
      if (e.animationName === 'menuHide') {
        renderMenu(products);
      }
      menuList.removeEventListener('animationend', renderAfterAniamtion);
    }
  }

  renderLoadMoreBtn(products.length);
}

async function getProductData(productName) {
  const res = await fetch('./products.json');
  const allProducts = await res.json();
  const product = allProducts.find((prod) => prod.name === `${productName}`);
  createModal(modalWrapper, product);
}

function renderMenu(products) {
  lengthOfMenu = 0;

  menuList.innerHTML = '';
  products.forEach((item, i) => {
    const menuItem = document.createElement('li');
    menuItem.classList.add('menu-item');
    if (window.innerWidth < 769 && i > 3) {
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
    menuItem.addEventListener('click', () => {
      modalWrapper.classList.remove('modal-hidden');
      modalWrapper.classList.add('modal-show');
      document.body.style.overflowY = 'hidden';
      getProductData(item.name);
    });
    menuList.append(menuItem);
    lengthOfMenu += 1;
  });
  menuList.classList.add('menu-show');
}

function updateMenuView(length) {
  const menuItems = document.querySelectorAll('.menu-item');
  const items = [...menuItems].filter((el, i) => i > 3);
  if (window.innerWidth >= 769 && length > 4) {
    items.forEach((el) => {
      el.classList.remove('hidden');
    });
  }
  if (window.innerWidth < 769 && length > 4) {
    items.forEach((el) => {
      el.classList.add('hidden');
    });
  }
}

function renderLoadMoreBtn(length) {
  if (window.innerWidth >= 769) {
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
    menuList.classList.remove('menu-hide', 'menu-show');
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
    burgerMenu.classList.contains('navigation-menu-show')
  ) {
    toggleBurger();
  }

  if (newWindowWidth < 769 && lastWindowWidth >= 769) {
    renderLoadMoreBtn(lengthOfMenu);
    updateMenuView(lengthOfMenu);
  }
  if (newWindowWidth >= 769 && lastWindowWidth < 769) {
    renderLoadMoreBtn(lengthOfMenu);
    updateMenuView(lengthOfMenu);
  }

  lastWindowWidth = newWindowWidth;
});

// modal
const totalPrice = {
  sizePrice: 0,
  addPrice: 0,
};

modalWrapper.addEventListener('click', (e) => {
  if (e.target === modalWrapper) {
    modalWrapper.classList.add('modal-close');
  }
});

modalWrapper.addEventListener('animationend', (e) => {
  if (e.animationName === 'mod-wrapper-close') {
    modalWrapper.classList.add('modal-hidden');
    modalWrapper.classList.remove('modal-show', 'modal-close');
    document.body.style.overflowY = '';
  }
});

const tabs = document.querySelectorAll('.tab-additive');
tabs.forEach((tab) => {
  tab.addEventListener('change', () => {
    console.log('tabchange');
  });
});

function createModal(wrapper, product) {
  createModalHTML(wrapper, product);
  totalPrice.sizePrice = 0;
  totalPrice.addPrice = 0;
  const sizesTabsBox = document.querySelector('.sizes-tabs-box');
  const additivesTabsBox = document.querySelector('.additives-tabs-box');
  const totalPriceElem = document.querySelector('.modal-total-price');
  const sizesObj = product.sizes;
  for (let size in sizesObj) {
    const inputSize = document.createElement('input');
    inputSize.type = 'radio';
    inputSize.id = `size-${size}`;
    inputSize.value = sizesObj[size].addprice;
    inputSize.name = 'size';
    const labelHTML = `
      <label class="modal-tab" for="size-${size}">
        <span class="tab-icon">${size.toUpperCase()}</span>
        <span class="tab-text">${sizesObj[size].size}</span>
      </label>
    `;
    sizesTabsBox.append(inputSize);
    sizesTabsBox.insertAdjacentHTML('beforeend', labelHTML);
    if (size === 's') {
      inputSize.checked = true;
      totalPrice.sizePrice = +product.price;
      updateTotalPrice();
    }
    inputSize.addEventListener('change', () => {
      totalPrice.sizePrice = +product.price + +inputSize.value;
      updateTotalPrice();
    });
  }

  const additivesArr = product.additives;
  additivesArr.forEach((additive, i) => {
    const inputAd = document.createElement('input');
    inputAd.type = 'checkbox';
    inputAd.id = `add-${i}`;
    inputAd.value = additive.addprice;
    const labelHTML = `
    <label class="modal-tab" for="add-${i}">
      <span class="tab-icon">${i + 1}</span>
      <span class="tab-text">${additive.name}</span>
    </label>
    `;
    additivesTabsBox.append(inputAd);
    additivesTabsBox.insertAdjacentHTML('beforeend', labelHTML);
    inputAd.addEventListener('change', () => {
      if (inputAd.checked) {
        totalPrice.addPrice += +inputAd.value;
      } else {
        totalPrice.addPrice -= +inputAd.value;
      }
      updateTotalPrice();
    });
  });

  function updateTotalPrice() {
    console.log('totalprice=', totalPrice);
    let total = (totalPrice.sizePrice + totalPrice.addPrice).toFixed(2);
    totalPriceElem.innerHTML = `$${total}`;
  }

  const closeBtn = document.querySelector('.modal-close-btn');
  closeBtn.addEventListener('click', () => {
    modalWrapper.classList.add('modal-close');
  });
}

function createModalHTML(wrapper, product) {
  wrapper.innerHTML = `
    <div class="modal-container">
    <div class="modal-image">
      <img src=${product.image} alt=${product.name}>
    </div>
    <div class="modal-content">
      <h3 class="modal-title">${product.name}</h3>
      <p class="modal-description">${product.description}</p>
      <div class="modal-tabs">
        <p class="modal-tabs-title">Size</p>
        <div class="modal-tabs-box sizes-tabs-box">
        </div>
      </div>
      <div class="modal-tabs">
        <p class="modal-tabs-title">Additives</p>
        <div class="modal-tabs-box additives-tabs-box">
        </div>
      </div>
      <div class="modal-total">
        <p class="modal-total-text">Total</p>
        <p class="modal-total-price"></p>
      </div>
      <div class="modal-alert">
        <img class="modal-alert-icon" src="../../assets/icons/info-empty.svg" alt="info-icon">
        <p class="modal-alert-text">The cost is not final. Download our mobile app to see the final price and place
          your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
      </div>
      <button class="modal-close-btn">Close</button>
    </div>
  </div>
  `;
}
