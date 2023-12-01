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
  lastWindowWidth = newWindowWidth;
});
