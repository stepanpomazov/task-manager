// Ждем полной загрузки DOM
        document.addEventListener('DOMContentLoaded', function() {
            // Получаем элементы по ID
            const modal = document.getElementById('employeeModal');
            const btn = document.getElementById('openModalBtn');
            const span = document.getElementsByClassName('close-btn')[0];
            
            // Открытие модального окна
            btn.addEventListener('click', function() {
                console.log('Кнопка нажата'); // Для отладки
                modal.style.display = 'block';
            });
            
            // Закрытие при клике на крестик
            span.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // Закрытие при клике вне окна
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });