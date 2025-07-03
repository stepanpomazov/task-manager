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

    // Блок месяца (оставляем без изменений)
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


    const departmentGroup = document.createElement('label');
    departmentGroup.textContent = 'Отделы';
    const departmentSelect = document.createElement('select');
    departmentSelect.id = 'departments';
    departmentSelect.size = 1;


    const defaultOption = document.createElement('option');
    defaultOption.value = '0';
    defaultOption.textContent = 'Все отделы';
    departmentSelect.appendChild(defaultOption);

    try {
        const departments = await fetchDepartmentTree();

        const addDepartments = (items, level = 0) => {
            items.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = ' '.repeat(level * 2) + dept.name;
                departmentSelect.appendChild(option);

                if (dept.children && dept.children.length) {
                    addDepartments(dept.children, level + 1);
                }
            });
        };

        addDepartments(departments);
    } catch (error) {
        console.error('Ошибка загрузки департаментов:', error);
        // Fallback - статичный список (как было раньше)
        ['1 отдел', '2 отдел', '3 отдел'].forEach((dep, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = dep;
            departmentSelect.appendChild(option);
        });
    }

    departmentGroup.appendChild(departmentSelect);


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

    const monitorButtons = [monitorByEmployeeBtn, monitorByProjectBtn];

    monitorButtons.forEach(button => {
        button.addEventListener('click', () => {
            monitorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Собираем форму (оставляем без изменений)
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