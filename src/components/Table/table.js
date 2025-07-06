export function renderTable(containerId = "table-wrapper") {
  // Удаляем предыдущую таблицу
  const existingTable = document.getElementById('department-table-container');
  if (existingTable) existingTable.remove();

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Создаем контейнер для таблицы
  const tableContainer = document.createElement('div');
  tableContainer.id = 'department-table-container';
  container.appendChild(tableContainer);

  const table = document.createElement('table');
  table.className = 'department-table';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  table.append(thead, tbody);
  tableContainer.appendChild(table);

  // Инициализируем состояние с текущей датой
  let currentState = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    departments: [],
    expandedDepartments: new Set()
  };

  // Обработчик события изменения даты из header
  document.addEventListener('dateChanged', (e) => {
    const { month, year } = e.detail;
    currentState.month = month;
    currentState.year = year;
    currentState.expandedDepartments = new Set(); // Сбрасываем раскрытые отделы
    updateTable();
  });

  const apiService = {
    async getDepartmentData(year, month) {
      try {
        const response = await fetch(`https://igpr25.tw1.ru/api/departments?year=${year}&month=${month}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching department data:', error);
        tableContainer.innerHTML = `<div class="error">Ошибка загрузки данных: ${error.message}</div>`;
        throw error;
      }
    }
  };

  function transformApiData(apiData, daysInMonth) {
    if (!apiData || typeof apiData !== 'object') return [];

    const departments = [];
    const departmentMap = {};

    function buildDepartment(node, parentId = null, level = 0) {
      if (!node || !node.id) return null;

      const department = {
        id: node.id,
        parentId,
        level,
        name: node.name,
        employees: [],
        subDepartments: [],
        hasChildren: false,
        toggleId: `dept-${node.id}`
      };

      if (Array.isArray(node.users)) {
        department.employees = node.users.map(user => ({
          id: user.id,
          name: user.name,
          dailyHours: user.daily_workload_hours || 0,
          scores: Array(daysInMonth).fill(user.daily_workload_hours || 0)
        }));
      }

      if (node.children && typeof node.children === 'object') {
        department.hasChildren = Object.keys(node.children).length > 0;

        for (const childId in node.children) {
          const childDept = buildDepartment(node.children[childId], node.id, level + 1);
          if (childDept) {
            department.subDepartments.push(childDept);
          }
        }
      }

      departmentMap[node.id] = department;

      if (parentId === null) {
        departments.push(department);
      }

      return department;
    }

    for (const rootId in apiData) {
      buildDepartment(apiData[rootId]);
    }

    return departments;
  }

  async function updateTable() {
    try {
      const daysInMonth = new Date(currentState.year, currentState.month + 1, 0).getDate();
      const apiData = await apiService.getDepartmentData(currentState.year, currentState.month + 1);
      currentState.departments = transformApiData(apiData, daysInMonth);

      updateTableHeader(daysInMonth);
      updateTableBody();
    } catch (error) {
      console.error('Error updating table:', error);
    }
  }

  function updateTableHeader(daysCount) {
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');

    const nameTh = document.createElement('th');
    nameTh.textContent = "Отдел / Сотрудник";
    headerRow.appendChild(nameTh);

    for (let day = 1; day <= daysCount; day++) {
      const dayTh = document.createElement('th');
      dayTh.textContent = day;
      const date = new Date(currentState.year, currentState.month, day);
      if (date.getDay() === 0 || date.getDay() === 6) dayTh.classList.add('weekend');
      headerRow.appendChild(dayTh);
    }

    const totalTh = document.createElement('th');
    totalTh.textContent = "Итого";
    headerRow.appendChild(totalTh);

    thead.appendChild(headerRow);
  }

  function createToggleIcon(expanded = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `toggle-icon ${expanded ? 'expanded' : ''}`);
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 12L10 8L6 4");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    return svg;
  }

  function createDepartmentRow(department) {
    const tr = document.createElement("tr");
    tr.className = `department-row ${department.level === 0 ? "main-department" : "sub-department"}`;
    tr.dataset.toggleId = department.toggleId;

    const nameTd = document.createElement("td");
    const div = document.createElement("div");
    div.className = "cell-content";
    div.style.paddingLeft = `${department.level * 20}px`;

    if (department.hasChildren) {
      div.appendChild(createToggleIcon(currentState.expandedDepartments.has(department.toggleId)));
      div.style.cursor = "pointer";
    } else {
      const spacer = document.createElement("span");
      spacer.style.width = "16px";
      spacer.style.display = "inline-block";
      div.appendChild(spacer);
    }

    div.appendChild(document.createTextNode(department.name));
    nameTd.appendChild(div);
    tr.appendChild(nameTd);

    const daysInMonth = new Date(currentState.year, currentState.month + 1, 0).getDate();
    for (let i = 0; i < daysInMonth; i++) {
      tr.appendChild(document.createElement("td"));
    }

    const totalTd = document.createElement("td");
    totalTd.textContent = calculateDepartmentTotal(department).toFixed(2);
    tr.appendChild(totalTd);

    return tr;
  }

  function createEmployeeRow(employee, department) {
    const tr = document.createElement("tr");
    tr.className = "employee-row";
    tr.style.display = currentState.expandedDepartments.has(department.toggleId) ? "" : "none";

    const nameTd = document.createElement("td");
    nameTd.style.paddingLeft = `${(department.level + 1) * 30}px`;
    nameTd.textContent = employee.name;
    tr.appendChild(nameTd);

    employee.scores.forEach(score => {
      const td = document.createElement("td");
      td.textContent = score > 0 ? score.toFixed(2) : "-";
      tr.appendChild(td);
    });

    const totalTd = document.createElement("td");
    totalTd.textContent = employee.scores.reduce((sum, score) => sum + score, 0).toFixed(2);
    tr.appendChild(totalTd);

    return tr;
  }

  function calculateDepartmentTotal(department) {
    let total = department.employees.reduce((sum, emp) => sum + emp.scores.reduce((s, score) => s + score, 0), 0);
    department.subDepartments.forEach(subDept => {
      total += calculateDepartmentTotal(subDept);
    });
    return total;
  }

  function updateTableBody() {
    tbody.innerHTML = '';

    function renderDepartment(department) {
      tbody.appendChild(createDepartmentRow(department));

      if (currentState.expandedDepartments.has(department.toggleId)) {
        department.subDepartments.forEach(subDept => {
          renderDepartment(subDept);
        });

        department.employees.forEach(emp => {
          tbody.appendChild(createEmployeeRow(emp, department));
        });
      }
    }

    currentState.departments.forEach(renderDepartment);
    setupTableToggles();
  }

  function setupTableToggles() {
    document.querySelectorAll(".department-row").forEach(row => {
      const toggleId = row.dataset.toggleId;
      const toggleIcon = row.querySelector(".toggle-icon");

      if (toggleIcon) {
        row.addEventListener("click", (e) => {
          if (e.target.closest(".cell-content")) {
            if (currentState.expandedDepartments.has(toggleId)) {
              currentState.expandedDepartments.delete(toggleId);
            } else {
              currentState.expandedDepartments.add(toggleId);
            }
            updateTableBody();
          }
        });
      }
    });
  }

  // Стили
  if (!document.getElementById('department-table-styles')) {
    const style = document.createElement("style");
    style.id = 'department-table-styles';
    style.textContent = `
      .department-table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
      }
      .department-table th, .department-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }
      .department-table th {
        background-color: #f2f2f2;
        position: sticky;
        top: 0;
      }
      .toggle-icon {
        transition: transform 0.2s;
        margin-right: 5px;
      }
      .toggle-icon.expanded {
        transform: rotate(90deg);
      }
      .main-department {
        background-color: #e6f2ff;
        font-weight: bold;
      }
      .sub-department {
        background-color: #f0f7ff;
      }
      .employee-row {
        background-color: #fff;
      }
      .cell-content {
        display: flex;
        align-items: center;
      }
      .weekend {
        background-color: #ffecec;
      }
      .error {
        color: red;
        padding: 20px;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  // Инициализация таблицы
  updateTable();
}