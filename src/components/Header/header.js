import { fetchDepartmentTree } from './data_header.js';

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

    // 1. Блок месяца
    const monthGroup = document.createElement('div');
    monthGroup.className = 'form-group';
    monthGroup.innerHTML = `
        <label>Месяц</label>
        <select id="monthSelect">
            ${["Январь","Февраль","Март","Апрель","Май","Июнь",
        "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
        .map((month, index) => `<option value="${index + 1}">${month}</option>`)
        .join('')}
        </select>
    `;

    // 2. Блок года
    const yearGroup = document.createElement('div');
    yearGroup.className = 'form-group';
    yearGroup.innerHTML = `
        <label>Год</label>
        <input type="number" id="yearInput" min="1980" max="2030" value="2025">
    `;

    // 3. Блок отделов с улучшенной иерархией
    const departmentGroup = document.createElement('div');
    departmentGroup.className = 'form-group department-group';
    departmentGroup.innerHTML = '<label>Отделы</label>';

    const departmentSelect = document.createElement('select');
    departmentSelect.id = 'departments';

    // Улучшенная функция для добавления отделов
    const addDepartments = (items, level = 0) => {
        items.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;

            // Минималистичные отступы и стрелки
            const indent = level > 0 ? '│' + ' '.repeat(level * 2 - 1) : '';
            const arrow = dept.children?.length ? '▼ ' : '  ';

            option.textContent = `${indent}${arrow}${dept.name}`;
            option.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

            // Добавляем CSS-классы для стилизации
            option.classList.add(`level-${level}`);
            if (dept.children?.length) {
                option.classList.add('has-children');
                option.style.fontWeight = '600';
            }

            departmentSelect.appendChild(option);

            // Рекурсивно добавляем подотделы
            if (dept.children?.length) {
                addDepartments(dept.children, level + 1);
            }
        });
    };

    // Добавляем "Все отделы" как первый элемент
    const defaultOption = document.createElement('option');
    defaultOption.value = '0';
    defaultOption.textContent = 'Все отделы';
    defaultOption.style.fontWeight = '600';
    departmentSelect.appendChild(defaultOption);

    try {
        const departments = await fetchDepartmentTree();
        addDepartments(departments);
    } catch (error) {
        console.error('Ошибка загрузки департаментов:', error);
        // Иерархический fallback на основе вашего примера
        const fallbackDepartments = [
            {
                id: 1,
                name: "Кровля",
                children: [
                    { id: 2, name: "Доборные элементы" },
                    {
                        id: 3,
                        name: "Металлочерепица",
                        children: [
                            { id: 4, name: "Монтеррей" },
                            { id: 5, name: "Супермонтеррей" }
                        ]
                    },
                    {
                        id: 6,
                        name: "Гибкая черепица",
                        children: [
                            { id: 7, name: "Shinglas" },
                            { id: 8, name: "Docke" },
                            { id: 9, name: "Icopal" }
                        ]
                    }
                ]
            },
            {
                id: 10,
                name: "Софиты",
                children: [
                    { id: 11, name: "Виниловые" },
                    { id: 12, name: "Алюминиевые" }
                ]
            }
        ];
        addDepartments(fallbackDepartments);
    }

    departmentGroup.appendChild(departmentSelect);

    // 4. Блок мониторинга
    const monitorGroup = document.createElement('div');
    monitorGroup.className = 'form-group monitor-group';
    monitorGroup.innerHTML = `
        <label>Мониторинг</label>
        <div class="button-group">
            <button type="button" class="monitor-btn active">По сотрудникам</button>
            <button type="button" class="monitor-btn">По проектам</button>
        </div>
    `;

    // 5. Кнопка "Показать"
    const showButton = document.createElement('button');
    showButton.type = 'button';
    showButton.className = 'show-btn';
    showButton.textContent = 'Показать';

    // Собираем форму
    formRow.appendChild(monthGroup);
    formRow.appendChild(yearGroup);
    formRow.appendChild(departmentGroup);
    formRow.appendChild(monitorGroup);
    formRow.appendChild(showButton);

    // Обработчики событий для кнопок мониторинга
    const monitorButtons = monitorGroup.querySelectorAll('.monitor-btn');
    monitorButtons.forEach(button => {
        button.addEventListener('click', () => {
            monitorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    header.appendChild(formRow);
    container.appendChild(header);

    // Возвращаем элементы для внешнего доступа
    return {
        monthSelect,
        yearInput,
        departmentSelect,
        monitorButtons,
        showButton
    };
}