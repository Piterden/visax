/**
 * Lexicon helper
 * @param  {string} langKey
 * @return {string} localized value
 */
var _ = function(langKey) {
  return visax.lexicon[langKey] || langKey;
};

webix.storage.local.put("data_helpers", {
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
  ],
  workTimes: [
    { id: "10:00", value: "10:00" },
    { id: "10:30", value: "10:30" },
    { id: "11:00", value: "11:00" },
    { id: "11:30", value: "11:30" },
    { id: "12:00", value: "12:00" },
    { id: "12:30", value: "12:30" },
    { id: "13:00", value: "13:00" },
    { id: "13:30", value: "13:30" },
    { id: "14:00", value: "14:00" },
    { id: "14:30", value: "14:30" },
    { id: "15:00", value: "15:00" },
    { id: "15:30", value: "15:30" },
    { id: "16:00", value: "16:00" },
    { id: "16:30", value: "16:30" },
    { id: "17:00", value: "17:00" },
    { id: "17:30", value: "17:30" }
  ],
  tripTargets: [
    { id: "tourism", value: "Туризм" },
    { id: "business", value: "Бизнес" },
    { id: "friends", value: "Посещение родственников/друзей" },
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

