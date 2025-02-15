# Тестовое задание для компании Van Gogh-Link

## Описание проекта

Данный проект представляет собой тестовое задание, выполненное для компании Van Gogh-Link. Проект разработан с использованием современного инструмента сборки Rollup.js, поддерживает адаптивный дизайн и включает в себя шаблоны, стили, изображения и шрифты.

---

## Структура проекта

- `src/`
  - `main.js`: Главный JavaScript файл проекта.
  - `images/`: Каталог для хранения изображений.
  - `fonts/`: Каталог для шрифтов.
  - `styles/`: Основные SCSS стили.
  - `ui/`: Компоненты пользовательского интерфейса.
  - `views/`: Шаблоны Pug.
- `build/`: Сборочный каталог, куда копируются все итоговые файлы после компиляции.

---

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/s1ick/Van-Gogh-Link.git
   ```

2. Перейдите в директорию проекта:
   ```bash
   cd template-rollup
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

---

## Скрипты

- `npm run dev`: Запуск проекта в режиме разработки с использованием Rollup.
- `npm run build`: Сборка проекта для продакшена.
- `npm run start`: Запуск Rollup с отслеживанием изменений.

---

## Конфигурация Rollup

Файл конфигурации `rollup.config.mjs` включает следующие плагины:

1. **rollup-plugin-pug**: Компиляция Pug-шаблонов.
2. **rollup-plugin-scss**: Компиляция SCSS стилей с использованием Sass.
3. **rollup-plugin-html**: Инъекция CSS и JS в HTML.
4. **rollup-plugin-copy**: Копирование статических файлов в директорию сборки.
5. **rollup-plugin-serve**: Локальный сервер для разработки.

---

## Используемые технологии

- **HTML**: Для разметки.
- **SCSS**: Для стилизации.
- **JavaScript (ES6)**: Для динамической работы.
- **Rollup.js**: Для сборки проекта.
- **Pug**: Шаблонизатор.
- **Sass**: Компилятор SCSS.

---

## Пример использования

1. Запустите локальный сервер разработки:
   ```bash
   npm run dev
   ```

2. Откройте браузер и перейдите по адресу:
   ```
   http://localhost:3000
   ```

3. Внесите изменения в файлы проекта, и Rollup автоматически пересоберёт проект с обновлениями.

---

## Контакты

Автор: Матвеев Иван  
Email: [berkut89@list.ru](mailto:berkut89@list.ru)

---


## Дополнительная информация

Репозиторий проекта доступен по адресу:  
[GitHub](https://github.com/s1ick/Van-Gogh-Link)

