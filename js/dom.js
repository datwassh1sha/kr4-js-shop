/*
  Помощники для работы с интерфейсом.

  Здесь собраны небольшие функции, которые используют сразу несколько
  страниц: создание элемента, безопасный вывод текста, очистка контейнера
  и форматирование цены.

  Важно: текстовая информация выводится только через textContent.
  Строки никогда не попадают в innerHTML, поэтому данные из формы,
  ссылки и хранилище не могут стать HTML-разметкой.
*/

const Dom = (() => {
  /*
    Создаёт элемент с классом и текстом.

    create("p", "product-card__price", "1000 ₽") — короткая запись вместо
    четырёх строк с createElement, className и textContent.
  */
  function create(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      // textContent превращает значение в текст, а не в разметку.
      element.textContent = String(text);
    }

    return element;
  }

  /*
    Полностью очищает контейнер перед новой отрисовкой.
  */
  function clear(container) {
    container.replaceChildren();
  }

  /*
    Классы состояний для блоков сообщений.
  */
  const MESSAGE_CLASSES = [
    "message--info",
    "message--success",
    "message--error",
  ];

  /*
    Показывает сообщение в подготовленном блоке.
    type: "info" | "success" | "error".

    Пустой текст прячет блок целиком, поэтому страница не «дышит»
    пустыми плашками. alert() и confirm() в проекте не используются.
  */
  function setMessage(element, text, type = "info") {
    if (!element) {
      return;
    }

    element.classList.remove(...MESSAGE_CLASSES);
    element.textContent = text || "";
    element.hidden = !text;

    if (text) {
      element.classList.add(`message--${type}`);
    }
  }

  /*
    Цена в формате 1 500 ₽.
  */
  function formatPrice(value) {
    return `${Number(value).toLocaleString("ru-RU")} ₽`;
  }

  return { create, clear, setMessage, formatPrice };
})();
