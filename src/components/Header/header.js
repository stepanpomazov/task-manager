export function renderHeader(containerId = 'header-container') {
const container = document.getElementById(containerId);
if (!container) {
console.error(`Container with id "${containerId}" not found.`);
return;
}

// Очистим контейнер перед рендером
container.innerHTML = '';

// Создаем структуру header
const header = document.createElement('div');
header.className = 'header';

// Форма в строке
const formRow = document.createElement('div');
formRow.className = 'form-row';

// Месяц
const monthGroup = document.createElement('label');
monthGroup.textContent = 'Месяц';
const monthSelect = document.createElement('select');
monthSelect.id = 'monthSelect';
monthSelect.name = 'month';

const months = [
"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

months.forEach((month, index) => {
const option = document.createElement('option');
option.value = index + 1;
option.textContent = month;
monthSelect.appendChild(option);
});

monthGroup.appendChild(monthSelect);

// Год
const yearGroup = document.createElement('label');
yearGroup.textContent = 'Год';
const yearInput = document.createElement('input');
yearInput.type = 'number';
yearInput.id = 'yearInput';
yearInput.name = 'year';
yearInput.min = 1980;
yearInput.max = 2030;
yearInput.value = 2025;
yearGroup.appendChild(yearInput);

// Отделы
const departmentGroup = document.createElement('label');
departmentGroup.textContent = 'Отделы';
const departmentSelect = document.createElement('select');
departmentSelect.id = 'departments';
departmentSelect.size = 1;

const departments = ['Все отделы', '1 отдел', '2 отдел', '3 отдел'];
departments.forEach((dep, index) => {
const option = document.createElement('option');
option.value = index;
option.textContent = dep;
departmentSelect.appendChild(option);
});

departmentGroup.appendChild(departmentSelect);

// Метка мониторинга
const monitorLabel = document.createElement('label');
monitorLabel.textContent = 'Мониторинг';

// Кнопки мониторинга
const monitorByEmployeeBtn = document.createElement('button');
monitorByEmployeeBtn.type = 'button';
monitorByEmployeeBtn.className = 'monitor-btn';
monitorByEmployeeBtn.textContent = 'По сотрудникам';

const monitorByProjectBtn = document.createElement('button');
monitorByProjectBtn.type = 'button';
monitorByProjectBtn.className = 'monitor-btn';
monitorByProjectBtn.textContent = 'По проектам';

// Кнопка "Показать"
const showButton = document.createElement('button');
showButton.type = 'button';
showButton.className = 'show-btn';
showButton.textContent = 'Показать';

// Логика переключения активной кнопки
const monitorButtons = [monitorByEmployeeBtn, monitorByProjectBtn];

monitorButtons.forEach(button => {
button.addEventListener('click', () => {
monitorButtons.forEach(btn => btn.classList.remove('active'));
button.classList.add('active');
});
});

// Собираем форму
formRow.appendChild(monthGroup);
formRow.appendChild(yearGroup);
formRow.appendChild(departmentGroup);
formRow.appendChild(monitorLabel);
formRow.appendChild(monitorByEmployeeBtn);
formRow.appendChild(monitorByProjectBtn);
formRow.appendChild(showButton);

header.appendChild(formRow);
container.appendChild(header);
}