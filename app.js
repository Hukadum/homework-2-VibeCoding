/* 
    Курс: Vibe Coding
    Домашнее задание №2: Конструктор посещения события
    Выполнил: Молчанов Константин
    Группа: М26-555
*/

const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": " Экскурсия с гидом ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// Функция для расчета стоимости и формирования отчета
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    if (!Array.isArray(services)) return { count: 0, total: 0, items: [] };

    // Оставляем только те услуги, которые выбрал пользователь
    const filtered = services.filter(service => {
        if (!service || !service.id) return false;
        if (service.id === 'guide' && guideChecked) return true;
        if (service.id === 'audio' && audioChecked) return true;
        if (service.id === 'catalog' && catalogChecked) return true;
        return false;
    });

    // Создаем новый массив, очищая названия от лишних пробелов
    const items = filtered.map(({ title, price }) => ({
        title: typeof title === 'string' ? title.trim() : '',
        price: Number(price) || 0
    }));

    // Считаем общую сумму
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const count = items.length;

    return { count, total, items };
}

// Основная логика работы со страницей
try {
    const data = JSON.parse(sourceJson);

    // Получаем ссылки на нужные элементы
    const eventTitle = document.querySelector('#event-title');
    const eventDate = document.querySelector('#event-date');
    const eventPlace = document.querySelector('#event-place');
    const eventDescription = document.querySelector('#event-description');
    const showProgramBtn = document.querySelector('#show-program');
    const programBlock = document.querySelector('#program');

    const serviceForm = document.querySelector('#service-form');
    const choiceError = document.querySelector('#choice-error');
    const dataError = document.querySelector('#data-error');
    const resultBlock = document.querySelector('#result');
    const reportJsonBlock = document.querySelector('#report-json');

    // Проверка на всякий случай
    if (!data || !data.event || !data.services) {
        throw new Error("Неверная структура JSON");
    }

    // Прячем ошибку, так как данные успешно загрузились
    if (dataError) dataError.hidden = true;

    // Заполняем карточку события текстом
    if (eventTitle) eventTitle.textContent = data.event.title || '';
    if (eventDate) eventDate.textContent = data.event.date || '';
    if (eventPlace) eventPlace.textContent = data.event.place || '';
    if (eventDescription) eventDescription.textContent = data.event.description || '';

    // Показываем форму и кнопку
    if (serviceForm) serviceForm.hidden = false;
    if (showProgramBtn) showProgramBtn.hidden = false;

    // Обработка клика по кнопке показа программы
    if (showProgramBtn && programBlock) {
        showProgramBtn.addEventListener('click', () => {
            programBlock.innerHTML = data.event.meeting || '';
            programBlock.hidden = false;
        });
    }

    // Обработка отправки формы
    if (serviceForm && choiceError && resultBlock && reportJsonBlock) {
        serviceForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const guideChecked = !!serviceForm.querySelector('#guide')?.checked;
            const audioChecked = !!serviceForm.querySelector('#audio')?.checked;
            const catalogChecked = !!serviceForm.querySelector('#catalog')?.checked;

            const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

            // Если пользователь ничего не выбрал, показываем предупреждение
            if (report.count === 0) {
                choiceError.hidden = false;
                resultBlock.hidden = true;
                reportJsonBlock.hidden = true;
                return;
            }

            // Если выбор есть, скрываем ошибку
            choiceError.hidden = true;

            // Формируем текст для вывода на экран
            let resultHtml = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;
            report.items.forEach(item => {
                resultHtml += `<br>${item.title}`;
            });

            resultBlock.innerHTML = resultHtml;
            resultBlock.hidden = false;

            // Превращаем объект в JSON-строку и выводим её
            const stringified = JSON.stringify(report);
            JSON.parse(stringified);

            reportJsonBlock.textContent = stringified;
            reportJsonBlock.hidden = false;
        });
    }

} catch (err) {
    // Если JSON сломан, скрываем интерфейс и показываем ошибку
    const dataError = document.querySelector('#data-error');
    const serviceForm = document.querySelector('#service-form');
    const showProgramBtn = document.querySelector('#show-program');
    const programBlock = document.querySelector('#program');
    const choiceError = document.querySelector('#choice-error');
    const resultBlock = document.querySelector('#result');
    const reportJsonBlock = document.querySelector('#report-json');

    if (dataError) dataError.hidden = false;
    if (serviceForm) serviceForm.hidden = true;
    if (showProgramBtn) showProgramBtn.hidden = true;
    if (programBlock) programBlock.hidden = true;
    if (choiceError) choiceError.hidden = true;
    if (resultBlock) resultBlock.hidden = true;
    if (reportJsonBlock) reportJsonBlock.hidden = true;
}
