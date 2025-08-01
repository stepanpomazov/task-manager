# Документация API для фронтенда

## Эндпоинт: Получение департаментов с пользователями и нагрузкой

**URL:** `/api/departments`  
**Метод:** `GET`  
**Описание:** Возвращает дерево департаментов с вложенными пользователями и их расчетной нагрузкой по задачам за указанный период.

### Параметры запроса:

| Параметр   | Тип    | Обязательный | Описание                                      | Формат примера                     |
|------------|--------|--------------|-----------------------------------------------|----------------------------------|
| `date_from`| string | Нет          | Начальная дата фильтрации задач по дате создания (включительно) | `2025-07-01T00:00:00Z`           |
| `date_to`  | string | Нет          | Конечная дата фильтрации задач по дате создания (включительно) | `2025-07-10T23:59:59Z`           |

### Пример запроса:
GET /api/departments?date_from=2025-07-01T00:00:00Z&date_to=2025-07-10T23:59:59Z

### Формат ответа:

Ответ — JSON объект, представляющий дерево департаментов. Каждый департамент содержит:

- `id` — ID департамента (строка или число)
- `name` — название департамента (строка)
- `children` — список дочерних департаментов (массив)
- `users` — список пользователей в департаменте (массив)

Каждый пользователь содержит:

- `id` — ID пользователя
- `name` — ФИО пользователя (строка)
- `email` — email пользователя (строка)
- `daily_workload_hours` — средняя нагрузка пользователя в часах в день (число с плавающей точкой)
- `total_task_hours` — суммарное запланированное время по задачам пользователя за период в часах (число с плавающей точкой)

### Пример ответа (фрагмент):

{
"123": {
"id": 123,
"name": "Отдел разработки",
"children": {
"124": {
"id": 124,
"name": "Подотдел мобильной разработки",
"children": {},
"users": [
{
"id": 45,
"name": "Иванов Иван",
"email": "ivanov@example.com",
"daily_workload_hours": 2.5,
"total_task_hours": 20.0
}
]
}
},
"users": []
}
}

---

## Эндпоинт: Получение упрощенного дерева департаментов (без пользователей)

**URL:** `/api/departments/tree`  
**Метод:** `GET`  
**Описание:** Возвращает дерево департаментов без информации о пользователях.

### Пример запроса:


---
GET /api/departments/tree

### Формат ответа:

Массив объектов департаментов с полями:

- `id` — ID департамента
- `name` — название департамента
- `children` — массив дочерних департаментов (рекурсивно)

### Пример ответа (фрагмент):

[
{
"id": 123,
"name": "Отдел разработки",
"children": [
{
"id": 124,
"name": "Подотдел мобильной разработки",
"children": []
}
]
},
{
"id": 125,
"name": "Отдел маркетинга",
"children": []
}
]

---

## Важные моменты для фронтенда

- Параметры `date_from` и `date_to` влияют на выборку задач для расчёта нагрузки.
- Если параметры не переданы, нагрузка считается по всем задачам пользователя.
- Время в нагрузке — это запланированное время (`timeEstimate` в секундах, конвертируется в часы).
- Средняя нагрузка считается как сумма часов по задачам, делённая на количество рабочих дней между датой создания задачи и дедлайном (или датой закрытия, если она раньше дедлайна).
- Рабочие дни — это дни с понедельника по пятницу, выходные (суббота и воскресенье) исключаются.

---

# Эндпоинт: Получение задач пользователя по дате с нагрузкой
**URL:** `/api/user_tasks_by_date`  
**Метод:** `GET`  
**Описание:** Возвращает список задач пользователя, которые активны в заданный день, с указанием названия задачи, ссылки на задачу в Bitrix24 и нагрузки (времени) на выбранный день.

---

## Параметры запроса

| Параметр | Тип    | Обязательный | Описание                          | Формат              |
|----------|--------|--------------|----------------------------------|---------------------|
| user_id  | string | Да           | Идентификатор пользователя       | Например: `123`      |
| date     | string | Да           | Дата для фильтрации задач        | Формат: `YYYY-MM-DD` |

---

## Пример запроса

GET /api/user_tasks_by_date?user_id=202&date=2025-07-03

---
### Формат ответа

Объект с полями:

- `date` — запрошенная дата (строка, формат `YYYY-MM-DD`)
- `user_id` — ID пользователя (строка)
- `tasks` — массив задач, активных в этот день

Каждая задача содержит:

- `id` — ID задачи (число)
- `title` — название задачи (строка)
- `link` — ссылка на задачу в Bitrix24 (строка)
- `workload` — нагрузка на выбранный день в человекочитаемом формате (строка, например `"2 ч"`, `"40 мин"`)

### Пример успешного ответа



## Пример успешного ответа

{
"date": "2025-07-03",
"user_id": "123",
"tasks": [
{
"id": 456,
"title": "Разработка функционала X",
"link": "https://intogroup.bitrix24.ru/company/personal/user/123/tasks/task/view/456/",
"workload": "2 ч"
},
{
"id": 789,
"title": "Тестирование модуля Y",
"link": "https://intogroup.bitrix24.ru/company/personal/user/123/tasks/task/view/789/",
"workload": "40 мин"
},
{
"id": 1011,
"title": "Мелкие правки",
"link": "https://intogroup.bitrix24.ru/company/personal/user/123/tasks/task/view/1011/",
"workload": "20 мин"
}
]
}

---

## Ошибки

| Код  | Описание                                |
|-------|----------------------------------------|
| 400   | Отсутствует параметр `user_id` или `date` |
| 400   | Неверный формат параметра `date` (ожидается `YYYY-MM-DD`) |
| 500   | Внутренняя ошибка сервера при обработке запроса |

---

## Примечания

- Время нагрузки рассчитывается только по рабочим дням (понедельник-пятница).
- Задачи с периодом активности, включающим выбранную дату, будут возвращены.
- Ссылка ведёт на страницу задачи в Bitrix24 для конкретного пользователя.

---