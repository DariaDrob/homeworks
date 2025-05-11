import './styles.css';
import './styles.scss';
import './styles.less';
import image from './image.jpg';
import * as _ from 'lodash';

document.body.innerHTML = `
  <h1 class="title css-title scss-title less-title">Привіт, Webpack!</h1>
  <img src="${image}" alt="Тестове зображення">
`;

console.log(_.join(['Hello', 'TypeScript'], ' '));