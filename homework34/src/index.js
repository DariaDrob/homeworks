import './styles.css';
import image from './image.jpg';
import lodash from 'lodash';

document.body.innerHTML = `
  <h1 class="title">Привіт, Webpack!</h1>
  <img src="${image}" alt="Тестове зображення">
`;

console.log(lodash.join(['Homework23'], ' '));
