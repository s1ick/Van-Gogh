import '../styles/style.scss';
import template from './views/template.pug';

document.getElementById('template').innerHTML = template();

// Элементы DOM
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__list');
const inputWrapper = document.querySelector('.input-wrapper');
const header = document.querySelector('.header');

// Логика для бургера
burger.addEventListener('click', function () {
    menu.classList.toggle('open'); // Открываем/закрываем меню
    burger.classList.toggle('active'); // Активируем/деактивируем бургер
});

// Логика для инпута
inputWrapper.addEventListener('mouseenter', function () {
    header.classList.add('input-active'); // Скрываем меню
});

inputWrapper.addEventListener('mouseleave', function () {
    header.classList.remove('input-active'); // Возвращаем меню
});
