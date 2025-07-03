import { fetchDepartmentTree } from "./data_header.js";

export async function renderHeader(containerId = 'header-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'header';

    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    // Блок месяца
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

    // Блок года
    const yearGroup = document.createElement('label');
    yearGroup.textContent = 'Год';
    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.id = 'yearInput';
    yearInput.name = 'year';
    yearInput.min = 1980;
    yearInput.max = 2030;
    yearInput.value = new Date().getFullYear();
    yearGroup.appendChild(yearInput);

    const departmentGroup = document.createElement('label');
    departmentGroup.className = 'department-group';
    departmentGroup.style.display = 'flex';
    departmentGroup.style.alignItems = 'center';
    departmentGroup.style.gap = '10px';

// Текст "Отделы"
    const departmentLabel = document.createElement('span');
    departmentLabel.textContent = 'Отделы';
    departmentLabel.style.whiteSpace = 'nowrap';
    departmentGroup.appendChild(departmentLabel);

// Контейнер для выпадающего списка
    const deptSelectContainer = document.createElement('div');
    deptSelectContainer.className = 'dept-select-container';
    deptSelectContainer.style.position = 'relative';
    deptSelectContainer.style.display = 'inline-flex';

// Триггер для открытия списка
    const deptTrigger = document.createElement('div');
    deptTrigger.className = 'dept-trigger';
    deptTrigger.textContent = 'Выберите отдел';
    deptTrigger.style.display = 'inline-flex';
    deptTrigger.style.alignItems = 'center';
    deptTrigger.style.minWidth = '180px';

// Выпадающий список
    const deptPopup = document.createElement('div');
    deptPopup.className = 'dept-popup';
    deptPopup.style.display = 'none';

    deptSelectContainer.appendChild(deptTrigger);
    deptSelectContainer.appendChild(deptPopup);
    departmentGroup.appendChild(deptSelectContainer);

    // Обработчики событий
    deptTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        deptPopup.style.display = deptPopup.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!deptSelectContainer.contains(e.target)) {
            deptPopup.style.display = 'none';
        }
    });

    // Загрузка и отрисовка дерева отделов
    try {
        const departments = await fetchDepartmentTree();
        let maxWidth = 180; // Минимальная ширина

        const renderDepartment = (items, level = 0) => {
            const container = document.createElement('div');
            container.className = 'dept-level';

            items.forEach(item => {
                const deptItem = document.createElement('div');
                deptItem.className = 'dept-item';
                deptItem.style.paddingLeft = `${level * 15}px`;

                const deptContent = document.createElement('div');
                deptContent.className = 'dept-content';

                if (item.children && item.children.length > 0) {
                    const toggle = document.createElement('span');
                    toggle.className = 'dept-toggle';
                    toggle.textContent = '▶';
                    deptContent.appendChild(toggle);
                } else {
                    const spacer = document.createElement('span');
                    spacer.className = 'dept-spacer';
                    spacer.textContent = ' ';
                    deptContent.appendChild(spacer);
                }

                const nameSpan = document.createElement('span');
                nameSpan.className = 'dept-name';
                nameSpan.textContent = item.name;
                deptContent.appendChild(nameSpan);

                deptItem.appendChild(deptContent);
                container.appendChild(deptItem);

                // Обработчик выбора (работает для всех элементов)
                deptContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deptTrigger.textContent = item.name;
                    deptTrigger.dataset.id = item.id;
                    deptPopup.style.display = 'none';
                });

                // Обработчик раскрытия
                if (item.children && item.children.length > 0) {
                    const childrenContainer = document.createElement('div');
                    childrenContainer.className = 'dept-children';
                    childrenContainer.style.display = 'none';

                    childrenContainer.appendChild(renderDepartment(item.children, level + 1));
                    deptItem.appendChild(childrenContainer);

                    const toggle = deptItem.querySelector('.dept-toggle');
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isHidden = childrenContainer.style.display === 'none';
                        childrenContainer.style.display = isHidden ? 'block' : 'none';
                        toggle.textContent = isHidden ? '▼' : '▶';

                        // Обновляем ширину popup
                        deptPopup.style.width = 'auto';
                        const newWidth = deptPopup.scrollWidth + 20;
                        if (newWidth > maxWidth) {
                            maxWidth = newWidth;
                            deptPopup.style.width = `${maxWidth}px`;
                        }
                    });
                }

                // Рассчитываем максимальную ширину
                const itemWidth = deptContent.scrollWidth + (level * 15) + 30;
                if (itemWidth > maxWidth) {
                    maxWidth = itemWidth;
                    deptPopup.style.width = `${maxWidth}px`;
                }
            });

            return container;
        };

        deptPopup.appendChild(renderDepartment(departments));
        deptPopup.style.width = `${maxWidth}px`;
    } catch (error) {
        console.error('Ошибка загрузки департаментов:', error);
        deptTrigger.textContent = 'Ошибка загрузки';
    }

    // Блок мониторинга
    const monitorLabel = document.createElement('label');
    monitorLabel.textContent = 'Мониторинг';

    const monitorByEmployeeBtn = document.createElement('button');
    monitorByEmployeeBtn.type = 'button';
    monitorByEmployeeBtn.className = 'monitor-btn';
    monitorByEmployeeBtn.textContent = 'По сотрудникам';

    const monitorByProjectBtn = document.createElement('button');
    monitorByProjectBtn.type = 'button';
    monitorByProjectBtn.className = 'monitor-btn';
    monitorByProjectBtn.textContent = 'По проектам';

    const showButton = document.createElement('button');
    showButton.type = 'button';
    showButton.className = 'show-btn';
    showButton.textContent = 'Показать';

    // Активация кнопок мониторинга
    [monitorByEmployeeBtn, monitorByProjectBtn].forEach(button => {
        button.addEventListener('click', () => {
            [monitorByEmployeeBtn, monitorByProjectBtn].forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    // Сборка формы
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