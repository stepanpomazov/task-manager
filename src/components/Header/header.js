import { fetchDepartmentTree } from "./data_header.js";

export async function renderHeader(containerId = "header-container") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  container.innerHTML = "";

  const header = document.createElement("div");
  header.className = "header";

  const formRow = document.createElement("div");
  formRow.className = "form-row";

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

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
      monthTrigger.querySelector(".month-trigger-text").textContent = month;
      monthSelect.value = index + 1;
      monthPopup.style.display = "none";
      monthTrigger.querySelector(".month-trigger-icon").style.transform =
        "rotate(0)";
      const event = new Event("change");
      monthSelect.dispatchEvent(event);
    });

    monthPopup.appendChild(monthButton);
  });

  monthGroup.appendChild(monthTrigger);
  monthGroup.appendChild(monthPopup);
  monthGroup.appendChild(monthSelect);

  monthTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    monthPopup.style.display =
      monthPopup.style.display === "none" ? "block" : "none";
    const icon = monthTrigger.querySelector(".month-trigger-icon");
    icon.style.transform =
      monthPopup.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
  });

  document.addEventListener("click", () => {
    monthPopup.style.display = "none";
    const icon = monthTrigger.querySelector(".month-trigger-icon");
    if (icon) icon.style.transform = "rotate(0)";
  });

  monthPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

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
      yearTrigger.querySelector(".year-trigger-text").textContent = year;
      yearInput.value = year;
      yearPopup.style.display = "none";
      yearTrigger.querySelector(".year-trigger-icon").style.transform =
        "rotate(0)";
    });

    yearPopup.appendChild(yearButton);
  }

  yearGroup.appendChild(yearTrigger);
  yearGroup.appendChild(yearPopup);
  yearGroup.appendChild(yearInput);

  yearTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    yearPopup.style.display =
      yearPopup.style.display === "none" ? "block" : "none";
    const icon = yearTrigger.querySelector(".year-trigger-icon");
    icon.style.transform =
      yearPopup.style.display === "block" ? "rotate(180deg)" : "rotate(0)";
  });

  document.addEventListener("click", () => {
    yearPopup.style.display = "none";
    const icon = yearTrigger.querySelector(".year-trigger-icon");
    if (icon) icon.style.transform = "rotate(0)";
  });

  yearPopup.addEventListener("click", (e) => e.stopPropagation());

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
    <span class="dept-trigger-text">Выберите отдел</span>
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

  deptTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    deptPopup.style.display =
      deptPopup.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!deptSelectContainer.contains(e.target)) {
      deptPopup.style.display = "none";
    }
  });

  try {
    const departments = await fetchDepartmentTree();
    let maxWidth = 180;

    const renderDepartment = (items, level = 0) => {
      const container = document.createElement("div");
      container.className = "dept-level";

      items.forEach((item) => {
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
          deptTrigger.textContent = item.name;
          deptTrigger.dataset.id = item.id;
          deptPopup.style.display = "none";
        });

        if (item.children && item.children.length > 0) {
          const childrenContainer = document.createElement("div");
          childrenContainer.className = "dept-children";
          childrenContainer.style.display = "none";

          childrenContainer.appendChild(
            renderDepartment(item.children, level + 1)
          );
          deptItem.appendChild(childrenContainer);

          const toggle = deptItem.querySelector(".dept-toggle");
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = childrenContainer.style.display === "none";
            childrenContainer.style.display = isHidden ? "block" : "none";
            toggle.style.transform = isHidden ? "rotate(0)" : "rotate(-90deg)";

            deptPopup.style.width = "auto";
            const newWidth = deptPopup.scrollWidth + 20;
            if (newWidth > maxWidth) {
              maxWidth = newWidth;
              deptPopup.style.width = `${maxWidth}px`;
            }
          });
        }

        const itemWidth = deptContent.scrollWidth + level * 15 + 30;
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
    console.error("Ошибка загрузки департаментов:", error);
    deptTrigger.textContent = "Ошибка загрузки";
  }

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

  const showButton = document.createElement("button");
  showButton.type = "button";
  showButton.className = "show-btn";
  showButton.textContent = "Показать";

  [monitorByEmployeeBtn, monitorByProjectBtn].forEach((button) => {
    button.addEventListener("click", () => {
      [monitorByEmployeeBtn, monitorByProjectBtn].forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  const headerLeft = document.createElement("div");
  headerLeft.className = "header-left form-row";

  const headerRight = document.createElement("div");
  headerRight.className = "header-right form-row";

  formRow.appendChild(monthGroup);
  formRow.appendChild(yearGroup);
  formRow.appendChild(departmentGroup);

  headerLeft.appendChild(formRow);

  headerRight.appendChild(monitorLabel);
  headerRight.appendChild(showButton);

  header.appendChild(headerLeft);
  header.appendChild(headerRight);

  container.appendChild(header);
}




// скрываем хедер
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const header = document.getElementById('header-container');

  // Функция для проверки размера экрана
  function handleScreenSize() {
    if (window.innerWidth < 1172) {
      // Если экран меньше 1172px:
      header.style.display = 'none !important'; // Скрываем header
      menuBtn.style.display = 'inline-block'; // Показываем кнопку
    } else {
      // Если экран ≥ 1172px:
      header.style.display = 'block'; // Показываем header
      menuBtn.style.display = 'none'; // Скрываем кнопку
    }
  }

  // Вызываем функцию при загрузке страницы
  handleScreenSize();

  // Обрабатываем изменение размера окна
  window.addEventListener('resize', handleScreenSize);
});










document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobilePopup = document.getElementById("mobile-popup");
  const popupContent = document.getElementById("popup-content");
  const overlay = document.querySelector(".overlay");

  // Проверка наличия всех элементов
  if (!menuBtn || !mobilePopup || !popupContent || !overlay) {
    console.error("Не все элементы найдены");
    return;
  }

  let popupInitialized = false;

  // Функция для рендера хедера в попапе
  async function renderHeaderInPopup() {
    if (!popupInitialized) {
      // Очищаем содержимое попапа
      popupContent.innerHTML = "";

      // Рендерим хедер прямо в попап
      await renderHeader("popup-content");

      // Можно дополнительно добавить обработчики событий для кнопок внутри попапа
      initPopupEvents();

      popupInitialized = true;
    }
  }

  // Инициализация событий внутри попапа (если нужно)
  function initPopupEvents() {
    // Пример: активные кнопки "По сотрудникам" / "По проектам"
    const monitorButtons = popupContent.querySelectorAll('.monitor-btn');
    if (monitorButtons.length >= 2) {
      const [byEmployeeBtn, byProjectBtn] = monitorButtons;

      byEmployeeBtn.addEventListener('click', () => {
        byEmployeeBtn.classList.add('active');
        byProjectBtn.classList.remove('active');
      });

      byProjectBtn.addEventListener('click', () => {
        byProjectBtn.classList.add('active');
        byEmployeeBtn.classList.remove('active');
      });
    }
  }

  // Функции открытия/закрытия меню
  function openMobileMenu() {
    renderHeaderInPopup(); // рендерим хедер при открытии попапа
    mobilePopup.classList.add("open");
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobilePopup.classList.remove("open");
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  // Обработчики событий
  menuBtn.addEventListener("click", openMobileMenu);
  overlay.addEventListener("click", closeMobileMenu);
  document.querySelector(".close-btn")?.addEventListener("click", closeMobileMenu);

  // Адаптация под размер экрана
  function handleResize() {
    if (window.innerWidth <= 1171) {
      menuBtn.style.display = "inline-block";
      document.getElementById("header-container").style.display = "none";
    } else {
      menuBtn.style.display = "none";
      document.getElementById("header-container").style.display = "block";
      closeMobileMenu();
    }
  }

  // Инициализация
  handleResize();
  window.addEventListener("resize", handleResize);
});
