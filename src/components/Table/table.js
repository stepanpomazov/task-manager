export function renderTable(containerId = "table-wrapper") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  const departments = [
    {
      name: "BACK",
      toggleId: "back-department",
      employees: [
        { name: "Иванов Иван", scores: Array(15).fill(20) },
        { name: "Петров Петр", scores: Array(15).fill(25) },
      ],
      subDepartments: [
        {
          name: "Коммерческий отдел",
          toggleId: "commerc-sub-department",
          parentId: "back-department",
          employees: [],
          subDepartments: [],
        },
        {
          name: "Отдел Back",
          toggleId: "back-sub-department",
          parentId: "back-department",
          employees: [{ name: "Сидоров Сидор", scores: Array(15).fill(30) }],
          subDepartments: [
            {
              name: "Отдел данных",
              toggleId: "back-sub-sub-department",
              parentId: "back-sub-department",
              employees: [
                { name: "Сидоров Сидор", scores: Array(15).fill(30) },
              ],
              subDepartments: [], 
            },
          ],
        },
        {
          name: "IT Отдел",
          toggleId: "it-department",
          parentId: "back-department",
          employees: [],
          subDepartments: [],
        },
      ],
    },
    {
      name: "FRONT",
      toggleId: "front-department",
      employees: [{ name: "Кузнецов Кузьма", scores: Array(15).fill(45) }],
      subDepartments: [],
    },
  ];

  const table = document.createElement("table");

  function createThead(dayCount) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    // Первый столбец — Имя
    const nameTh = document.createElement("th");
    nameTh.textContent = "Имя";
    tr.appendChild(nameTh);

    // Столбцы по дням
    for (let i = 1; i <= dayCount; i++) {
      const th = document.createElement("th");
      th.textContent = i.toString();
      tr.appendChild(th);
    }

    // Последний столбец — Итог
    const totalTh = document.createElement("th");
    totalTh.textContent = "Итог";
    tr.appendChild(totalTh);

    thead.appendChild(tr);
    return thead;
  }

  // Этап 2: Генерация заголовка
  const dayCount = 15; // Пока 15 дней по умолчанию
  const theadElement = createThead(dayCount);
  table.appendChild(theadElement);

  // Этап 3: Пустое тело таблицы (позже добавим строки сотрудников)
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // Этап 4: Очистка и вставка в контейнер
  container.innerHTML = "";
  container.appendChild(table);

  // Этап 5: Добавления иконки выпадающегося списка
  function createToggleIcon() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "toggle-icon");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M6 12L10 8L6 4");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path);
    return svg;
  }

  // Этап 6: Формирование отделов

  // Создаём строку отдела (уровень вложенности задаёт класс)
  function createDepartmentRow(dept, level, parentId) {
    const tr = document.createElement("tr");

    if (level === 0) {
      tr.className = "main-department top-level";
    } else if (level === 1) {
      tr.className = "sub-department";
    } else {
      tr.className = "sub-sub-department"; // можно добавить стили для 3+ уровня
    }

    tr.dataset.toggle = dept.toggleId;
    if (parentId) {
      tr.dataset.parent = parentId;
    }

    const td = document.createElement("td");
    td.colSpan = dayCount + 2;

    const div = document.createElement("div");
    div.className = "cell-content";

    div.appendChild(createToggleIcon());
    div.append(dept.name);

    // Добавляем отступ по уровню
    div.style.paddingLeft = `${level * 20}px`;

    td.appendChild(div);
    tr.appendChild(td);

    return tr;
  }

  // Создаём строку сотрудника
  function createEmployeeRow(employee, parentId, level) {
    const tr = document.createElement("tr");

    // Классы для сотрудников в зависимости от уровня вложенности
    if (level === 0) {
      tr.className = "employee";
    } else {
      tr.className = "employee-nested";
    }

    if (parentId) {
      tr.dataset.parent = parentId;
    }

    const tdName = document.createElement("td");
    const div = document.createElement("div");
    div.className = "name-indent";
    div.textContent = employee.name;

    // Отступ для сотрудников
    div.style.paddingLeft = `${(level + 1) * 30}px`;

    tdName.appendChild(div);
    tr.appendChild(tdName);

    // Дни
    for (let i = 0; i < dayCount; i++) {
      const td = document.createElement("td");
      td.textContent = employee.scores?.[i] ?? "";
      tr.appendChild(td);
    }

    const tdTotal = document.createElement("td");
    tdTotal.textContent = "Итог"; // сюда потом можно сумму поставить
    tr.appendChild(tdTotal);

    return tr;
  }

  // Рекурсивно рендерим отделы и сотрудников
  function renderDepartments(depts, parentId = null, level = 0) {
    for (const dept of depts) {
      tbody.appendChild(createDepartmentRow(dept, level, parentId));

      dept.employees.forEach((emp) => {
        tbody.appendChild(createEmployeeRow(emp, dept.toggleId, level));
      });

      if (dept.subDepartments && dept.subDepartments.length > 0) {
        renderDepartments(dept.subDepartments, dept.toggleId, level + 1);
      }
    }
  }

  renderDepartments(departments);
  setupTableToggles();

  function setupTableToggles() {
    document.querySelectorAll("[data-parent]").forEach((row) => {
      row.classList.add("hidden");
    });

    document
      .querySelectorAll(
        ".main-department, .sub-department, .sub-sub-department"
      )
      .forEach((row) => {
        row.addEventListener("click", function () {
          const toggleId = this.getAttribute("data-toggle");
          if (!toggleId) return;

          const icon = this.querySelector(".toggle-icon");
          icon?.classList.toggle("rotated");

          const shouldShow = icon?.classList.contains("rotated");
          toggleChildren(toggleId, shouldShow);
        });
      });

    function toggleChildren(parentId, show) {
      const children = document.querySelectorAll(
        `tr[data-parent="${parentId}"]`
      );
      children.forEach((child) => {
        child.classList.toggle("hidden", !show);

        const childToggleId = child.getAttribute("data-toggle");
        const childIcon = child.querySelector(".toggle-icon");

        if (childToggleId && !show) {
          childIcon?.classList.remove("rotated");
          toggleChildren(childToggleId, false);
        }
      });
    }
  }
}
