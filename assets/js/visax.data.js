webix.storage.local.put("helpers_data", {
    regions: [
        { id: 1, value: "Северо-Западный федеральный округ" },
        { id: 2, value: "Центральный федеральный округ" },
        { id: 3, value: "Южный федеральный округ" },
        { id: 4, value: "Северо-Кавказский федеральный округ" },
        { id: 5, value: "Приволжский федеральный округ" },
        { id: 6, value: "Уральский федеральный округ" },
        { id: 7, value: "Сибирский федеральный округ" },
        { id: 8, value: "Дальневосточный федеральный округ" },
        { id: 9, value: "Крымский федеральный округ" }
    ]
});

webix.i18n.locales["ru-RU"] = {
    groupDelimiter: " ",
    groupSize: 3,
    decimalDelimiter: ",",
    decimalSize: 2,

    dateFormat: "%d.%m.%Y",
    timeFormat: "%H:%i",
    longDateFormat: "%d %F %Y",
    fullDateFormat: "%d.%m.%Y %H:%i",

    price: "{obj} руб.",
    priceSettings: null, //use number defaults

    calendar: {
        monthFull: ["Январь", "Февраль", "Март", "Апрель", "Maй", "Июнь", "Июль", "Август", "Сентябрь", "Oктябрь", "Ноябрь", "Декабрь"],
        monthShort: ["Янв", "Фев", "Maр", "Aпр", "Maй", "Июн", "Июл", "Aвг", "Сен", "Окт", "Ноя", "Дек"],
        dayFull: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        hours: "Часы",
        minutes: "Минуты",
        done: "Гoтовo",
        clear: "Очистить",
        today: "Сегодня"
    },

    controls: {
        select: "Выбрать"
    }
};
