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

// slider

const slider = document.querySelector('.slider__inner');
console.log('slider', slider);
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const countOfSlides = 3;

let numbActiveSlide = 1;
let sliderTimerId = null;
let isPaused = false;
let nextControl = document.getElementById('control-1');
nextControl.classList.add('control-active');

function moveSlider(direction) {
  let numbNextSlide = null;
  if (direction === 'to-left') {
    numbNextSlide =
      numbActiveSlide + 1 <= countOfSlides ? numbActiveSlide + 1 : 1;
  } else if (direction === 'to-right') {
    numbNextSlide =
      numbActiveSlide - 1 > 0 ? numbActiveSlide - 1 : countOfSlides;
  }
  nextControl.classList.remove('control-active', 'control-paused');
  slider.style.transform = `
    translateX(${(-100 / countOfSlides) * (numbNextSlide - 1)}%)
  `;
  nextControl = document.getElementById(`control-${numbNextSlide}`);
  nextControl.addEventListener('animationend', animationendControlHandler);
  slider.addEventListener('transitionend', transitionendHandler);

  function transitionendHandler() {
    console.log('transitionend slider');
    nextControl.classList.add('control-active');
    numbActiveSlide = numbNextSlide;
    slider.removeEventListener('transitionend', transitionendHandler);
  }
}

rightArrow.addEventListener('click', () => {
  moveSlider('to-left');
});

leftArrow.addEventListener('click', () => {
  moveSlider('to-right');
});

slider.addEventListener('mouseenter', () => {
  console.log('ponterenter');
  nextControl.classList.add('control-paused');
});

slider.addEventListener('mouseleave', () => {
  console.log('ponterleave');
  nextControl.classList.remove('control-paused');
});

nextControl.addEventListener('animationend', animationendControlHandler);

function animationendControlHandler() {
  console.log('animationend control');
  moveSlider('to-left');
}

// swiper
let startX;
let startY;
slider.addEventListener(
  'touchstart',
  (e) => {
    console.log('touchstart');
    nextControl.classList.add('control-paused');
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  },
  false
);

slider.addEventListener(
  'touchend',
  (e) => {
    let diffX;

    diffX = e.changedTouches[0].clientX - startX;

    if (diffX > 100) {
      moveSlider('to-right');
    }

    if (diffX < 100) {
      moveSlider('to-left');
    }
  },
  false
);
