export function renderTable(containerId = "table-wrapper") {
  // Удаляем предыдущую таблицу
  const existingTable = document.getElementById("department-table-container");
  if (existingTable) existingTable.remove();

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Создаем контейнер для таблицы
  const tableContainer = document.createElement("div");
  tableContainer.id = "department-table-container";
  container.appendChild(tableContainer);

  const table = document.createElement("table");
  table.className = "department-table";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.append(thead, tbody);
  tableContainer.appendChild(table);

  // Инициализируем состояние с текущей датой
  let currentState = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    departmentId: null,
    departments: [],
    expandedDepartments: new Set(),
  };

  // Обработчик события изменения даты из header
  document.addEventListener("dateChanged", (e) => {
    const { month, year, departmentId } = e.detail;
    currentState.month = month;
    currentState.year = year;
    currentState.departmentId = departmentId || null;
    currentState.expandedDepartments = new Set(); // Сбрасываем раскрытые отделы
    updateTable();
  });

  const apiService = {
    async getDepartmentData(year, month, departmentId = null) {
      try {
        let url = `https://igpr25.tw1.ru/api/departments?year=${year}&month=${month}`;
        if (departmentId) {
          url += `&department_id=${departmentId}`;
        }

        const response = await fetch(url);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching department data:", error);
        tableContainer.innerHTML = `<div class="error">Ошибка загрузки данных: ${error.message}</div>`;
        throw error;
      }
    },
  };

  function transformApiData(apiData, daysInMonth, year, month) {
    if (!apiData || typeof apiData !== "object") return [];

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
        toggleId: `dept-${node.id}`,
      };

      if (Array.isArray(node.users)) {
        department.employees = node.users.map((user) => {
          // Создаём массив часов по дням месяца, заполняем 0
          const scores = [];

          for (let day = 1; day <= daysInMonth; day++) {
            // Формируем дату в формате YYYY-MM-DD
            const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            // Получаем часы нагрузки по дате или 0, если нет
            const hours =
              user.daily_load_details && user.daily_load_details[dateKey]
                ? user.daily_load_details[dateKey]
                : 0;

            scores.push(hours);
          }

          return {
            id: user.id,
            name: user.name,
            totalTaskHours: user.total_task_hours || 0,
            scores,
          };
        });
      }

      if (node.children && typeof node.children === "object") {
        department.hasChildren = Object.keys(node.children).length > 0;

        for (const childId in node.children) {
          const childDept = buildDepartment(
            node.children[childId],
            node.id,
            level + 1
          );
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
      const daysInMonth = new Date(
        currentState.year,
        currentState.month + 1,
        0
      ).getDate();
      const apiData = await apiService.getDepartmentData(
        currentState.year,
        currentState.month + 1,
        currentState.departmentId // 🔹 передаём
      );
      currentState.departments = transformApiData(
        apiData,
        daysInMonth,
        currentState.year,
        currentState.month + 1
      );
      console.log("Итоговая структура departments:", currentState.departments);

      updateTableHeader(daysInMonth);
      updateTableBody();
    } catch (error) {
      console.error("Error updating table:", error);
    }
  }

  function updateTableHeader(daysCount) {
    thead.innerHTML = "";
    const headerRow = document.createElement("tr");

    const nameTh = document.createElement("th");
    nameTh.textContent = "Отдел / Сотрудник";
    nameTh.style.textAlign = "left"; 
    headerRow.appendChild(nameTh);

    for (let day = 1; day <= daysCount; day++) {
      const dayTh = document.createElement("th");
      dayTh.textContent = day;
      const date = new Date(currentState.year, currentState.month, day);
      if (date.getDay() === 0 || date.getDay() === 6)
        dayTh.classList.add("weekend");
      headerRow.appendChild(dayTh);
    }

    const totalTh = document.createElement("th");
    totalTh.textContent = "Итого";
    headerRow.appendChild(totalTh);

    thead.appendChild(headerRow);
  }

  function createToggleIcon(expanded = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `toggle-icon ${expanded ? "expanded" : ""}`);
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
    tr.className = `department-row ${
      department.level === 0 ? "main-department" : "sub-department"
    }`;
    tr.dataset.toggleId = department.toggleId;

    const nameTd = document.createElement("td");
    nameTd.style.textAlign = "left";     
    const div = document.createElement("div");
    div.className = "cell-content";
    div.style.paddingLeft = `${department.level * 16}px`;

    if (department) {
      div.appendChild(
        createToggleIcon(
          currentState.expandedDepartments.has(department.toggleId)
        )
      );
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

    const daysInMonth = new Date(
      currentState.year,
      currentState.month + 1,
      0
    ).getDate();
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
    tr.style.display = currentState.expandedDepartments.has(department.toggleId)
      ? ""
      : "none";

    const nameTd = document.createElement("td");
    nameTd.style.paddingLeft = `${(department.level + 1) * 30}px`;
    nameTd.textContent = employee.name;
    tr.appendChild(nameTd);

    employee.scores.forEach((score) => {
      const td = document.createElement("td");
      td.textContent = score > 0 ? score.toFixed(2) : "";
      tr.appendChild(td);
    });

    const totalTd = document.createElement("td");
    totalTd.textContent = employee.scores
      .reduce((sum, score) => sum + score, 0)
      .toFixed(2);
    tr.appendChild(totalTd);

    return tr;
  }

  function calculateDepartmentTotal(department) {
    let total = department.employees.reduce(
      (sum, emp) => sum + emp.scores.reduce((s, score) => s + score, 0),
      0
    );
    department.subDepartments.forEach((subDept) => {
      total += calculateDepartmentTotal(subDept);
    });
    return total;
  }

  function updateTableBody() {
    tbody.innerHTML = "";

    function renderDepartment(department) {
      tbody.appendChild(createDepartmentRow(department));

      if (currentState.expandedDepartments.has(department.toggleId)) {
        department.subDepartments.forEach((subDept) => {
          renderDepartment(subDept);
        });

        department.employees.forEach((emp) => {
          tbody.appendChild(createEmployeeRow(emp, department));
        });
      }
    }

    currentState.departments.forEach(renderDepartment);
    setupTableToggles();
  }

  function setupTableToggles() {
    document.querySelectorAll(".department-row").forEach((row) => {
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



  // Инициализация таблицы
  updateTable();
}
