import { fetchDepartmentTree } from "./data_header.js";

export async function renderHeader(containerId = "header-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  container.innerHTML = `
    <button class="burger-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="header"></div>
    <div class="mobile-menu-overlay"></div>
    <div class="mobile-menu">
      <button class="close-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="mobile-header"></div>
    </div>
  `;

  const header = container.querySelector('.header');
  const mobileHeader = container.querySelector('.mobile-header');
  const burgerButton = container.querySelector('.burger-button');
  const mobileMenu = container.querySelector('.mobile-menu');
  const mobileMenuOverlay = container.querySelector('.mobile-menu-overlay');
  const closeButton = container.querySelector('.close-button');

  // Создаем элементы хедера
  const createHeaderContent = () => {
    const formRow = document.createElement("div");
    formRow.className = "form-row";

    const months = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    // Месяц
    const monthGroup = document.createElement("label");
    monthGroup.textContent = "Месяц";
    monthGroup.style.position = "relative";

    const monthSelect = document.createElement("select");
    monthSelect.id = "monthSelect";
    monthSelect.name = "month";
    monthSelect.style.display = "none";

    months.forEach((month, index) => {
      const option = document.createElement("option");
      option.value = index + 1;
      option.textContent = month;
      monthSelect.appendChild(option);
    });

    const monthTrigger = document.createElement("button");
    monthTrigger.className = "month-trigger";
    monthTrigger.innerHTML = `
      <span class="month-trigger-text">${months[new Date().getMonth()]}</span>
      <span class="month-trigger-icon">
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M0.72 1C0.98 0.74 1.4 0.74 1.66 1L3.54 2.88C3.93 3.27 4.57 3.27 4.96 2.88L6.84 1C7.1 0.74 7.52 0.74 7.78 1C8.04 1.26 8.04 1.68 7.78 1.94L4.96 4.76C4.57 5.15 3.93 5.15 3.54 4.76L0.72 1.94C0.46 1.68 0.46 1.26 0.72 1" fill="currentColor"/>
        </svg>
      </span>
    `;

    const monthPopup = document.createElement("div");
    monthPopup.className = "month-popup";
    monthPopup.style.display = "none";

    months.forEach((month, index) => {
      const monthButton = document.createElement("button");
      monthButton.className = "month-option";
      monthButton.textContent = month;

      monthButton.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".month-trigger-text").forEach(el => {
          el.textContent = month;
        });
        monthSelect.value = index + 1;
        document.querySelectorAll(".month-popup").forEach(popup => {
          popup.style.display = "none";
        });
        document.querySelectorAll(".month-trigger-icon").forEach(icon => {
          icon.style.transform = "rotate(0)";
        });
        monthSelect.dispatchEvent(new Event("change"));
      });

      monthPopup.appendChild(monthButton);
    });

    monthGroup.appendChild(monthTrigger);
    monthGroup.appendChild(monthPopup);
    monthGroup.appendChild(monthSelect);

    // Год
    const yearGroup = document.createElement("label");
    yearGroup.textContent = "Год";
    yearGroup.style.position = "relative";

    const yearInput = document.createElement("input");
    yearInput.type = "hidden";
    yearInput.id = "yearInput";
    yearInput.name = "year";

    const yearTrigger = document.createElement("button");
    yearTrigger.className = "year-trigger";
    yearTrigger.innerHTML = `
      <span class="year-trigger-text">${new Date().getFullYear()}</span>
      <span class="year-trigger-icon">
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M0.72 1C0.98 0.74 1.4 0.74 1.66 1L3.54 2.88C3.93 3.27 4.57 3.27 4.96 2.88L6.84 1C7.1 0.74 7.52 0.74 7.78 1C8.04 1.26 8.04 1.68 7.78 1.94L4.96 4.76C4.57 5.15 3.93 5.15 3.54 4.76L0.72 1.94C0.46 1.68 0.46 1.26 0.72 1" fill="currentColor"/>
        </svg>
      </span>
    `;

    const yearPopup = document.createElement("div");
    yearPopup.className = "year-popup";
    yearPopup.style.display = "none";

    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 2; year++) {
      const yearButton = document.createElement("button");
      yearButton.className = "year-option";
      yearButton.textContent = year;

      yearButton.addEventListener("click", () => {
        document.querySelectorAll(".year-trigger-text").forEach(el => {
          el.textContent = year;
        });
        yearInput.value = year;
        document.querySelectorAll(".year-popup").forEach(popup => {
          popup.style.display = "none";
        });
        document.querySelectorAll(".year-trigger-icon").forEach(icon => {
          icon.style.transform = "rotate(0)";
        });
      });

      yearPopup.appendChild(yearButton);
    }

    yearGroup.appendChild(yearTrigger);
    yearGroup.appendChild(yearPopup);
    yearGroup.appendChild(yearInput);

    // Отделы
    const departmentGroup = document.createElement("label");
    departmentGroup.className = "department-group";
    departmentGroup.style.display = "flex";
    departmentGroup.style.alignItems = "center";
    departmentGroup.style.gap = "10px";

    const departmentLabel = document.createElement("span");
    departmentLabel.textContent = "Отделы";
    departmentLabel.style.whiteSpace = "nowrap";
    departmentGroup.appendChild(departmentLabel);

    const deptSelectContainer = document.createElement("div");
    deptSelectContainer.className = "dept-select-container";
    deptSelectContainer.style.position = "relative";
    deptSelectContainer.style.display = "inline-flex";

    const deptTrigger = document.createElement("div");
    deptTrigger.className = "dept-trigger";
    deptTrigger.innerHTML = `
      <span class="dept-trigger-text">Все отделы</span>
      <span class="dept-trigger-icon">
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.720256 0.999742C0.979771 0.740227 1.40046 0.739998 1.66026 0.99923L3.54367 2.87854C3.93401 3.26803 4.56599 3.26803 4.95634 2.87854L6.83975 0.99923C7.09954 0.739998 7.52023 0.740227 7.77974 0.999742C8.03946 1.25946 8.03946 1.68054 7.77974 1.94025L4.95711 4.76289C4.56658 5.15342 3.93342 5.15342 3.54289 4.76289L0.720256 1.94025C0.46054 1.68054 0.460541 1.25946 0.720256 0.999742Z" fill="currentColor"/>
        </svg>
      </span>
    `;

    const deptPopup = document.createElement("div");
    deptPopup.className = "dept-popup";
    deptPopup.style.display = "none";

    deptSelectContainer.appendChild(deptTrigger);
    deptSelectContainer.appendChild(deptPopup);
    departmentGroup.appendChild(deptSelectContainer);

    // Мониторинг
    const monitorLabel = document.createElement("label");
    monitorLabel.textContent = "Мониторинг";

    const monitorButtonsContainer = document.createElement("div");
    monitorButtonsContainer.className = "monitor-buttons";

    const monitorByEmployeeBtn = document.createElement("button");
    monitorByEmployeeBtn.type = "button";
    monitorByEmployeeBtn.className = "monitor-btn active";
    monitorByEmployeeBtn.textContent = "По сотрудникам";

    const monitorByProjectBtn = document.createElement("button");
    monitorByProjectBtn.type = "button";
    monitorByProjectBtn.className = "monitor-btn";
    monitorByProjectBtn.textContent = "По проектам";

    monitorButtonsContainer.appendChild(monitorByEmployeeBtn);
    monitorButtonsContainer.appendChild(monitorByProjectBtn);
    monitorLabel.appendChild(monitorButtonsContainer);

    // Кнопка Показать
    const showButton = document.createElement("button");
    showButton.type = "button";
    showButton.className = "show-btn";
    showButton.textContent = "Показать";

    // Собираем структуру
    formRow.appendChild(monthGroup);
    formRow.appendChild(yearGroup);
    formRow.appendChild(departmentGroup);

    const headerLeft = document.createElement("div");
    headerLeft.className = "header-left form-row";
    headerLeft.appendChild(formRow);

    const headerRight = document.createElement("div");
    headerRight.className = "header-right form-row";
    headerRight.appendChild(monitorLabel);
    headerRight.appendChild(showButton);

    return {
      headerLeft,
      headerRight,
      monthTrigger,
      monthPopup,
      yearTrigger,
      yearPopup,
      deptTrigger,
      deptPopup,
      deptSelectContainer,
      monitorByEmployeeBtn,
      monitorByProjectBtn
    };
  };

  const {
    headerLeft,
    headerRight,
    monthTrigger,
    monthPopup,
    yearTrigger,
    yearPopup,
    deptTrigger,
    deptPopup,
    deptSelectContainer,
    monitorByEmployeeBtn,
    monitorByProjectBtn
  } = createHeaderContent();

  // Добавляем элементы в оба хедера
  header.appendChild(headerLeft.cloneNode(true));
  header.appendChild(headerRight.cloneNode(true));

  mobileHeader.appendChild(headerLeft.cloneNode(true));
  mobileHeader.appendChild(headerRight.cloneNode(true));

  // Обработчики для элементов управления
  function setupEventListeners() {
    // Месяц
    document.querySelectorAll(".month-trigger").forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const popup = trigger.nextElementSibling;
        popup.style.display = popup.style.display === "none" ? "block" : "none";
        const icon = trigger.querySelector(".month-trigger-icon");
        icon.style.transform = popup.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
      });
    });

    // Год
    document.querySelectorAll(".year-trigger").forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const popup = trigger.nextElementSibling;
        popup.style.display = popup.style.display === "none" ? "block" : "none";
        const icon = trigger.querySelector(".year-trigger-icon");
        icon.style.transform = popup.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
      });
    });

    // Отделы
    document.querySelectorAll(".dept-trigger").forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const popup = trigger.nextElementSibling;
        popup.style.display = popup.style.display === "none" ? "block" : "none";
      });
    });

    // Мониторинг
    document.querySelectorAll(".monitor-btn").forEach(button => {
      button.addEventListener("click", function() {
        document.querySelectorAll(".monitor-btn").forEach(btn => {
          btn.classList.remove("active");
        });
        this.classList.add("active");
      });
    });
  }

  // Загрузка и отображение структуры отделов
  try {
    const departments = await fetchDepartmentTree();
    let maxWidth = 180;

    const renderDepartment = (items, level = 0) => {
      const container = document.createElement("div");
      container.className = "dept-level";

      items.forEach(item => {
        const deptItem = document.createElement("div");
        deptItem.className = "dept-item";
        deptItem.style.paddingLeft = `${level * 15}px`;

        const deptContent = document.createElement("div");
        deptContent.className = "dept-content";

        if (item.children && item.children.length > 0) {
          const toggle = document.createElement("span");
          toggle.className = "dept-toggle";
          toggle.innerHTML = `
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.720256 0.999742C0.979771 0.740227 1.40046 0.739998 1.66026 0.99923L3.54367 2.87854C3.93401 3.26803 4.56599 3.26803 4.95634 2.87854L6.83975 0.99923C7.09954 0.739998 7.52023 0.740227 7.77974 0.999742C8.03946 1.25946 8.03946 1.68054 7.77974 1.94025L4.95711 4.76289C4.56658 5.15342 3.93342 5.15342 3.54289 4.76289L0.720256 1.94025C0.46054 1.68054 0.460541 1.25946 0.720256 0.999742Z" fill="currentColor"/>
            </svg>
          `;
          toggle.style.transform = "rotate(-90deg)";
          deptContent.appendChild(toggle);
        } else {
          const spacer = document.createElement("span");
          spacer.className = "dept-spacer";
          spacer.innerHTML = `
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.720256 0.999742C0.979771 0.740227 1.40046 0.739998 1.66026 0.99923L3.54367 2.87854C3.93401 3.26803 4.56599 3.26803 4.95634 2.87854L6.83975 0.99923C7.09954 0.739998 7.52023 0.740227 7.77974 0.999742C8.03946 1.25946 8.03946 1.68054 7.77974 1.94025L4.95711 4.76289C4.56658 5.15342 3.93342 5.15342 3.54289 4.76289L0.720256 1.94025C0.46054 1.68054 0.460541 1.25946 0.720256 0.999742Z" fill="transparent"/>
            </svg>
          `;
          deptContent.appendChild(spacer);
        }

        const nameSpan = document.createElement("span");
        nameSpan.className = "dept-name";
        nameSpan.textContent = item.name;
        deptContent.appendChild(nameSpan);

        deptItem.appendChild(deptContent);
        container.appendChild(deptItem);

        deptContent.addEventListener("click", (e) => {
          e.stopPropagation();
          document.querySelectorAll(".dept-trigger-text").forEach(el => {
            el.textContent = item.name;
          });
          document.querySelectorAll(".dept-popup").forEach(popup => {
            popup.style.display = "none";
          });
        });

        if (item.children && item.children.length > 0) {
          const childrenContainer = document.createElement("div");
          childrenContainer.className = "dept-children";
          childrenContainer.style.display = "none";
          childrenContainer.appendChild(renderDepartment(item.children, level + 1));
          deptItem.appendChild(childrenContainer);

          const toggle = deptItem.querySelector(".dept-toggle");
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.style.display === "none";
            childrenContainer.style.display = isHidden ? "block" : "none";
            toggle.style.transform = isHidden ? "rotate(0)" : "rotate(-90deg)";
          });
        }
      });

      return container;
    };

    const deptStructure = renderDepartment(departments);
    document.querySelectorAll(".dept-popup").forEach(popup => {
      popup.appendChild(deptStructure.cloneNode(true));
    });
  } catch (error) {
    console.error("Ошибка загрузки департаментов:", error);
    document.querySelectorAll(".dept-trigger-text").forEach(el => {
      el.textContent = "Ошибка загрузки";
    });
  }

  // Устанавливаем обработчики событий
  setupEventListeners();

  // Обработчики для бургер-меню
  burgerButton.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeButton.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  mobileMenuOverlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Глобальные обработчики для закрытия попапов
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".month-group") && !e.target.closest(".month-popup")) {
      document.querySelectorAll(".month-popup").forEach(popup => {
        popup.style.display = "none";
      });
      document.querySelectorAll(".month-trigger-icon").forEach(icon => {
        icon.style.transform = "rotate(0)";
      });
    }

    if (!e.target.closest(".year-group") && !e.target.closest(".year-popup")) {
      document.querySelectorAll(".year-popup").forEach(popup => {
        popup.style.display = "none";
      });
      document.querySelectorAll(".year-trigger-icon").forEach(icon => {
        icon.style.transform = "rotate(0)";
      });
    }

    if (!e.target.closest(".dept-select-container") && !e.target.closest(".dept-popup")) {
      document.querySelectorAll(".dept-popup").forEach(popup => {
        popup.style.display = "none";
      });
    }
  });

  // Адаптация к размерам экрана
  function handleResize() {
    if (window.innerWidth >= 1170) {
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize();
}