# UTM-генератор ссылок / UTM Link Generator

Сборка UTM-ссылок для 14 каналов. Поддерживает обычные ссылки, динамические шаблоны Google Ads и Яндекс Директа, нормализацию меток, копирование и CSV.

Автор: [Марат Аксанов](https://aksanov.digital/about), [Aksanov.Digital](https://aksanov.digital).

## Онлайн-версии

- [utm-generator](https://aksanov.digital/tools/analytics/utm-generator)

Весь каталог: [инструменты для маркетинга и бизнеса](https://aksanov.digital/tools).

## Запуск

Скачайте или клонируйте репозиторий. Откройте `index.html` в современном браузере. Сборка и регистрация не нужны. Для локального сервера:

```sh
python3 -m http.server 8080
```

Откройте `http://localhost:8080`. Страницы инструмента:

- `index.html`

## Данные и зависимости

Вводные и загруженные отчеты обрабатываются в браузере. Код инструмента не отправляет их на сервер и не подключается к рекламным аккаунтам. В этой версии нет счетчиков сайта и скриптов Tilda.

Внешних JavaScript-библиотек нет.

Для загрузки внешней библиотеки нужен интернет. В запросах к CDN передаются обычные сетевые данные, включая IP; содержимое загруженного отчета туда не отправляется. Внешние изображения из исходной страницы также могут загружаться с CDN. Пользовательские шрифты не включены, используется системный запасной шрифт из исходного стека.

## Ограничения

Динамические макросы подставляет рекламная система при показе или переходе. При открытии шаблона напрямую в браузере значения макросов не заменяются. Проверяйте поддерживаемые параметры в документации выбранной системы.

## Проверки

```sh
npm install
npm test
```

Проверки используют синтетические вводные, расчетные примеры и файлы. Зависимости из `devDependencies` нужны для тестов; для открытия инструмента установка npm-пакетов не требуется.

## Исходная версия

Код выделен из опубликованных страниц Aksanov.Digital 2026-10-06. Расчетные формулы и пороги сохранены. HTML, CSS и JavaScript разнесены по файлам; внутренние ссылки ведут на исходный сайт. Источники и контрольные суммы фрагментов: [provenance.json](provenance.json).

## Как сослаться

Используйте кнопку GitHub «Cite this repository» или файл [CITATION.cff](CITATION.cff). В статье, презентации или описании своей доработки можно указать:

> Марат Аксанов. UTM-генератор ссылок. Aksanov.Digital. https://aksanov.digital/tools/analytics/utm-generator

Ссылка на онлайн-версию при упоминании инструмента приветствуется. MIT требует сохранить уведомление об авторстве и текст лицензии в копиях кода; добавлять ссылку на сайт по условиям лицензии не требуется.

## Лицензия

[MIT](LICENSE), copyright 2026 Marat Aksanov. Лицензия относится к коду и документации этого проекта. Сторонние библиотеки и внешние медиа остаются под собственными лицензиями.

## English

Client-side UTM campaign URL builder with 14 channel presets. Includes Google Ads and Yandex Direct macro templates, parameter normalization, copy controls and CSV export.

Author: [Marat Aksanov](https://aksanov.digital/about). Original tools and methodology: [Aksanov.Digital](https://aksanov.digital/tools).

Open `index.html` in a modern browser, or serve the folder with `python3 -m http.server 8080`. No build step or account is required. Input data stays in the browser. Excel features require the pinned third-party CDN library noted above. This source snapshot excludes Tilda runtime and analytics. See [CITATION.cff](CITATION.cff) for attribution and [LICENSE](LICENSE) for MIT terms.
