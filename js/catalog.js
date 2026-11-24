/*
  Каталог: поиск, фильтрация, сортировка и отрисовка карточек.

  Карточки не лежат в HTML — они собираются из js/products.js при каждом
  изменении фильтров. Поэтому разметка карточки описана в одном месте
  (js/product-card.js), а новые товары достаточно добавить в данные.
*/

(() => {
  const grid = document.querySelector("#catalog-grid");

  //Модуль подключается только на странице каталога.
  if (!grid) {
    return;
  }

  const filtersForm = document.querySelector("#filters-form");
  const searchInput = document.querySelector("#catalog-search");
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  const priceFromInput = document.querySelector("#price-from");
  const priceToInput = document.querySelector("#price-to");
  const sortSelect = document.querySelector("#catalog-sort");
  const resetButton = document.querySelector("#filters-reset");
  const emptyResetButton = document.querySelector("#catalog-empty-reset");

  const countOutput = document.querySelector("#catalog-count");
  const messageOutput = document.querySelector("#catalog-message");
  const emptyState = document.querySelector("#catalog-empty");

  /*
    Все товары в виде массива записей [id, product].
  */
  const allProducts = Object.entries(products);

  /*
    Приводит строку к виду, удобному для поиска:
    нижний регистр, «ё» → «е», лишние пробелы убраны.
  */
  function normalize(text) {
    return String(text).toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
  }

  /*
    Текущее состояние фильтров, снятое с элементов формы.
  */
  function readFilters() {
    const selectedCategory = document.querySelector(
      'input[name="category"]:checked'
    );

    return {
      query: normalize(searchInput.value),
      category: selectedCategory ? selectedCategory.value : "all",
      priceFrom: priceFromInput.value === "" ? null : Number(priceFromInput.value),
      priceTo: priceToInput.value === "" ? null : Number(priceToInput.value),
      sort: sortSelect.value,
    };
  }

  /*
    Проверка диапазона цены.

    Возвращает текст ошибки или пустую строку. Это единственная проверка,
    которую нельзя описать атрибутами HTML: она сравнивает два поля.
  */
  function validatePriceRange(filters) {
    const hasNegative =
      (filters.priceFrom !== null && filters.priceFrom < 0) ||
      (filters.priceTo !== null && filters.priceTo < 0);

    if (hasNegative) {
      return "Цена не может быть отрицательной.";
    }

    if (
      filters.priceFrom !== null &&
      filters.priceTo !== null &&
      filters.priceFrom > filters.priceTo
    ) {
      return "Цена «От» не может быть больше цены «До».";
    }

    return "";
  }

  /*
    Фильтрация: категория, поиск по названию, диапазон цены.
  */
  function filterProducts(filters) {
    return allProducts.filter(([, product]) => {
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }

      if (filters.query && !normalize(product.title).includes(filters.query)) {
        return false;
      }

      if (filters.priceFrom !== null && product.price < filters.priceFrom) {
        return false;
      }

      if (filters.priceTo !== null && product.price > filters.priceTo) {
        return false;
      }

      return true;
    });
  }

  /*
    Сортировка копии массива — исходные данные не меняются.

    price: по цене, title: по названию; направление задаётся знаком.
  */
  function sortProducts(items, sort) {
    const sorted = [...items];

    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a[1].price - b[1].price);
        break;

      case "price-desc":
        sorted.sort((a, b) => b[1].price - a[1].price);
        break;

      case "title-asc":
        sorted.sort((a, b) => a[1].title.localeCompare(b[1].title, "ru"));
        break;

      case "title-desc":
        sorted.sort((a, b) => b[1].title.localeCompare(a[1].title, "ru"));
        break;

      //"default" — исходный порядок из данных о товарах.
      default:
        break;
    }

    return sorted;
  }

  /*
    Склонение слова «товар» по числу.
  */
  function pluralizeProducts(count) {
    const lastTwo = count % 100;
    const last = count % 10;

    if (lastTwo >= 11 && lastTwo <= 14) {
      return "товаров";
    }

    if (last === 1) {
      return "товар";
    }

    if (last >= 2 && last <= 4) {
      return "товара";
    }

    return "товаров";
  }

  /*
    Отрисовка результата.
  */
  function render() {
    const filters = readFilters();
    const error = validatePriceRange(filters);

    //Ошибку диапазона показываем вместо списка, но список не стираем.
    Dom.setMessage(messageOutput, error, "error");

    if (error) {
      priceToInput.setAttribute("aria-invalid", "true");
      countOutput.textContent = "";
      return;
    }

    priceToInput.removeAttribute("aria-invalid");

    const found = sortProducts(filterProducts(filters), filters.sort);

    Dom.clear(grid);

    found.forEach(([id, product]) => {
      grid.append(ProductCard.create(id, product));
    });

    renderCount(found.length, filters);
    emptyState.hidden = found.length > 0;
    grid.hidden = found.length === 0;
  }

  /*
    Подпись «Найдено 3 товара из 4» с учётом активных фильтров.
  */
  function renderCount(foundCount, filters) {
    const total = allProducts.length;

    //Все товары без поиска и ограничений — сообщать нечего.
    const noFilters =
      filters.query === "" &&
      filters.category === "all" &&
      filters.priceFrom === null &&
      filters.priceTo === null;

    if (noFilters) {
      countOutput.textContent = `Всего ${total} ${pluralizeProducts(total)}`;
      return;
    }

    if (foundCount === 0) {
      countOutput.textContent = "Ничего не найдено";
      return;
    }

    countOutput.textContent = `Найдено ${foundCount} ${pluralizeProducts(foundCount)} из ${total}`;
  }

  /*
    Поиск с небольшой задержкой, чтобы список не перестраивался
    на каждое нажатие клавиши.
  */
  let searchTimer = null;

  searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(render, 200);
  });

  //Фильтры применяются сразу при переключении категории.
  categoryInputs.forEach((input) => {
    input.addEventListener("change", render);
  });

  //Сортировка тоже работает без кнопки «Применить».
  sortSelect.addEventListener("change", render);

  /*
    Кнопка «Применить фильтры» проверяет диапазон цены и перерисовывает
    список. Без preventDefault браузер перезагрузил бы страницу.
  */
  filtersForm.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  /*
    Сброс возвращает значения по умолчанию.
    Кнопка type="reset" очищает форму уже после клика, поэтому отрисовка
    откладывается на следующий кадр — иначе фильтры ещё старые.
  */
  function resetFilters() {
    filtersForm.reset();
    window.setTimeout(() => {
      render();
      searchInput.focus();
    }, 0);
  }

  resetButton.addEventListener("click", resetFilters);
  emptyResetButton.addEventListener("click", resetFilters);

  //Первая отрисовка при открытии страницы.
  render();
})();
