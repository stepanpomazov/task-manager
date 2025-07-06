import { renderHeader } from './components/Header/header.js';
import { renderTable } from './components/Table/table.js';

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderTable();
});





// main.js
document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById("header-container");

  if (!headerContainer) {
    console.error("Элемент #header-container не найден.");
    return;
  }

  // Генерируем содержимое хедера
  const form = document.createElement("form");
  form.className = "header-form";

  const select = document.createElement("select");
  select.innerHTML = `
    <option>Отдел 1</option>
    <option>Отдел 2</option>
  `;

  const input = document.createElement("input");
  input.type = "number";
  input.value = new Date().getFullYear();

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Показать";

  form.appendChild(select);
  form.appendChild(input);
  form.appendChild(button);

  headerContainer.appendChild(form);
});


