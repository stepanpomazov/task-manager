export function renderModal() {
  // Создаем элементы модального окна
  const modal = document.createElement('div');
  modal.id = 'employeeModal';
  modal.className = 'employee-modal';
  
  // Создаем кнопку открытия (если её нет в HTML)
  const openModalBtn = document.createElement('button');
  openModalBtn.id = 'openModalBtn';
  openModalBtn.textContent = 'Открыть информацию';
  document.body.appendChild(openModalBtn);

  // Создаем содержимое модального окна
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Кнопка закрытия
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&#10006;';

  // Заголовок с именем
  const nameHeader = document.createElement('h1');
  nameHeader.className = 'employee-name';
  nameHeader.textContent = 'Иванов Иван';

  // Секция нагрузки
  const workloadSection = createWorkloadSection();

  // Секция задач
  const tasksSection = createTasksSection();

  // Собираем модальное окно
  modalContent.append(closeBtn, nameHeader, workloadSection, tasksSection);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Добавляем обработчики событий
  setupModalHandlers(modal, openModalBtn, closeBtn);

  // Добавляем стили
  addModalStyles();
}

function createWorkloadSection() {
  const section = document.createElement('div');
  section.className = 'workload-section';
  
  const header = document.createElement('h2');
  header.textContent = 'Нагрузка';
  
  const monthContainer = document.createElement('div');
  monthContainer.className = 'workload-item';
  const monthLabel = document.createElement('span');
  monthLabel.className = 'workload-label';
  monthLabel.textContent = 'Общая нагрузка на месяц:';
  const monthValue = document.createElement('span');
  monthValue.className = 'workload-value';
  monthValue.textContent = '20 часов';
  monthContainer.append(monthLabel, monthValue);
  
  const dayContainer = document.createElement('div');
  dayContainer.className = 'workload-item';
  const dayLabel = document.createElement('span');
  dayLabel.className = 'workload-label';
  dayLabel.textContent = 'Общая нагрузка на день:';
  const dayValue = document.createElement('span');
  dayValue.className = 'workload-value';
  dayValue.textContent = '3 часа';
  dayContainer.append(dayLabel, dayValue);
  
  const divider = document.createElement('div');
  divider.className = 'divider';
  
  section.append(header, monthContainer, dayContainer, divider);
  return section;
}

function createTasksSection() {
  const section = document.createElement('div');
  section.className = 'tasks-section';
  
  // Создаем контейнер для заголовка и статуса
  const titleContainer = document.createElement('div');
  titleContainer.className = 'task-title-container';
  
  const header = document.createElement('h3');
  header.textContent = 'Задачи';
  
  const status = document.createElement('span'); // Изменено с div на span
  status.className = 'task-status';
  status.textContent = 'ACTIVE';
  
  // Добавляем заголовок и статус в один контейнер
  titleContainer.append(header, status);
  
  const taskList = document.createElement('div');
  taskList.className = 'task-list';
  
  const tasks = [
    { name: 'Разработка формы авторизации:', time: '1,5 час', link: 'https://intogroup.bitrix24.ru/company/personal/user/lu...' },
    { name: 'Настройка API:', time: '30 мин', link: 'https://intogroup.bitrix24.ru/company/personal/user/lu...' },
    { name: 'Рефакторинг компонента таблицы:', time: '1 час', link: 'https://intogroup.bitrix24.ru/company/personal/user/lu...' }
  ];
  
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    
    // Создаем контейнер для названия задачи и времени
    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';
    
    const taskName = document.createElement('span'); // Изменено на span
    taskName.className = 'task-name';
    taskName.textContent = task.name;
    
    const taskTime = document.createElement('span'); // Изменено на span
    taskTime.className = 'task-time';
    taskTime.textContent = task.time;
    
    // Добавляем название и время в одну строку
    taskHeader.append(taskName, ' ', taskTime);
    
    const taskLink = document.createElement('a');
    taskLink.className = 'task-link';
    taskLink.href = task.link;
    taskLink.textContent = task.link;
    taskLink.target = '_blank';
    
    taskItem.append(taskHeader, taskLink);
    taskList.appendChild(taskItem);
});

  section.append(header, status, taskList);
  return section;


  titleContainer.append(header, status);
}


// Функция для настройки обработчиков событий
function setupModalHandlers(modal, openBtn, closeBtn) {
  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  
  closeBtn.addEventListener('click', () => closeModal(modal));
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
  
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal(modal);
    }
  });
}

// Функция закрытия модального окна
function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}