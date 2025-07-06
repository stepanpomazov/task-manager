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

      // Создаем элементы для выбора месяца
      const monthGroup = document.createElement("label");
      monthGroup.textContent = "Месяц";
      
      const monthSelect = document.createElement("select");
      monthSelect.id = "monthSelect";
      
      const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                     "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
      months.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
      });
      
      monthGroup.appendChild(monthSelect);

      // Создаем элементы для выбора года
      const yearGroup = document.createElement("label");
      yearGroup.textContent = "Год";
      
      const yearInput = document.createElement("input");
      yearInput.type = "number";
      yearInput.id = "yearInput";
      yearInput.value = new Date().getFullYear();
      
      yearGroup.appendChild(yearInput);

      // Создаем элементы для выбора отдела
      const departmentGroup = document.createElement("label");
      departmentGroup.textContent = "Отдел";
      
      const deptSelect = document.createElement("select");
      deptSelect.id = "deptSelect";
      
      // Загружаем департаменты
      try {
        const departments = await fetchDepartmentTree();
        const renderDepartments = (items, level = 0) => {
          items.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = ' '.repeat(level * 2) + item.name;
            deptSelect.appendChild(option);
            
            if (item.children) {
              renderDepartments(item.children, level + 1);
            }
          });
        };
        
        renderDepartments(departments);
      } catch (error) {
        console.error("Ошибка загрузки департаментов:", error);
      }
      
      departmentGroup.appendChild(deptSelect);

      // Создаем элементы для выбора типа мониторинга
      const monitorLabel = document.createElement("label");
      monitorLabel.textContent = "Мониторинг";
      
      const monitorButtons = document.createElement("div");
      monitorButtons.className = "monitor-buttons";
      
      const byEmployeeBtn = document.createElement("button");
      byEmployeeBtn.type = "button";
      byEmployeeBtn.textContent = "По сотрудникам";
      byEmployeeBtn.classList.add("active");
      
      const byProjectBtn = document.createElement("button");
      byProjectBtn.type = "button";
      byProjectBtn.textContent = "По проектам";
      
      monitorButtons.appendChild(byEmployeeBtn);
      monitorButtons.appendChild(byProjectBtn);
      monitorLabel.appendChild(monitorButtons);

      // Кнопка "Показать"
      const showButton = document.createElement("button");
      showButton.type = "button";
      showButton.className = "show-btn";
      showButton.textContent = "Показать";

      // Группируем элементы
      const headerLeft = document.createElement("div");
      headerLeft.className = "header-left";
      headerLeft.appendChild(formRow);
      
      formRow.appendChild(monthGroup);
      formRow.appendChild(yearGroup);
      formRow.appendChild(departmentGroup);

      const headerRight = document.createElement("div");
      headerRight.className = "header-right";
      headerRight.appendChild(monitorLabel);
      headerRight.appendChild(showButton);

      header.appendChild(headerLeft);
      header.appendChild(headerRight);
      container.appendChild(header);

      // Инициализация мобильного меню
      initMobileMenu();
    }

    function initMobileMenu() {
      const menuBtn = document.getElementById('mobileMenuBtn');
      const mobilePopup = document.getElementById('mobile-popup');
      const closeBtn = mobilePopup.querySelector('.close-btn');
      const headerContainer = document.getElementById('header-container');

      // Копируем содержимое хедера в попап
      if (headerContainer && mobilePopup) {
        const headerClone = headerContainer.cloneNode(true);
        headerClone.style.display = 'block';
        mobilePopup.insertBefore(headerClone, closeBtn.nextSibling);
      }

      menuBtn.addEventListener('click', function() {
        mobilePopup.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });

      closeBtn.addEventListener('click', function() {
        mobilePopup.style.display = 'none';
        document.body.style.overflow = '';
      });

      mobilePopup.addEventListener('click', function(e) {
        if (e.target === mobilePopup) {
          mobilePopup.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
      renderHeader();
    });