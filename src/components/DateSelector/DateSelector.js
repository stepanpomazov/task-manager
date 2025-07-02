function renderDateSelector() {
    const years = Array.from({length: 5}, (_, i) => 2021 + i);
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const html = `
    <h2>Выберите месяц и год:</h2>
    <div class="date-controls">
      <select class="year-select">
        ${years.map(year =>
        `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`
    ).join('')}
      </select>
      <select class="month-select">
        ${months.map((month, index) =>
        `<option value="${index + 1}" ${index === currentMonth ? 'selected' : ''}>${month}</option>`
    ).join('')}
      </select>
    </div>
  `;

    document.getElementById('date-selector').innerHTML = html;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', renderDateSelector);