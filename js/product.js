/*
  Страница товара.

  Данные берутся из js/products.js, поэтому одна страница product.html
  показывает любой товар по ссылке product.html?id=….

  Ошибки и служебные сообщения выводятся текстом в блоки страницы,
  без alert() и без вставки HTML из строк.
*/

(() => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = Object.prototype.hasOwnProperty.call(products, productId)
    ? products[productId]
    : null;

  const detailsSection = document.querySelector("#product-details");
  const specsSection = document.querySelector("#product-specifications");
  const notFoundSection = document.querySelector("#product-not-found");
  const breadcrumb = document.querySelector("#breadcrumb-product");
  const cartMessage = document.querySelector("#cart-message");
  const addButton = document.querySelector("#add-to-cart");

  /*
    Товара нет — показываем пустое состояние вместо карточки.
  */
  if (!product) {
    detailsSection.hidden = true;
    specsSection.hidden = true;
    notFoundSection.hidden = false;

    breadcrumb.textContent = "Товар не найден";
    document.title = "Товар не найден | Hot Wheels Deals";

    return;
  }

  /*
    Заголовок, крошки и название вкладки.
  */
  document.title = `${product.title} | Hot Wheels Deals`;
  breadcrumb.textContent = product.title;

  /*
    Главное изображение: srcset собирается из подготовленных размеров.
  */
  const image = document.querySelector("#product-image");

  if (product.imageSet) {
    const { path, ext, widths } = product.imageSet;

    image.srcset = widths.map((width) => `${path}-${width}.${ext} ${width}w`).join(", ");
    image.sizes = "(max-width: 991px) 92vw, 50vw";
  }

  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = product.imageWidth;
  image.height = product.imageHeight;

  /*
    Текстовые блоки — только через textContent.
  */
  document.querySelector("#product-title").textContent = product.title;
  document.querySelector("#product-short-description").textContent =
    product.shortDescription;
  document.querySelector("#product-description").textContent =
    product.description;
  document.querySelector("#product-price").textContent = Dom.formatPrice(
    product.price
  );

  /*
    Бейдж: подпись и класс оформления зависят от данных товара.
  */
  const badge = document.querySelector("#product-badge");
  const badgeModifiers = {
    Новинка: "product-card__badge--new",
    Хит: "product-card__badge--hit",
    Лимитка: "product-card__badge--limited",
  };

  badge.classList.remove(
    "product-card__badge--new",
    "product-card__badge--hit",
    "product-card__badge--limited"
  );

  badge.textContent = product.badge || "";
  badge.hidden = !product.badge;

  if (product.badge && badgeModifiers[product.badge]) {
    badge.classList.add(badgeModifiers[product.badge]);
  }

  /*
    Характеристики.
  */
  document.querySelector("#product-manufacturer").textContent =
    product.manufacturer;
  document.querySelector("#product-scale").textContent = product.scale;
  document.querySelector("#product-material").textContent = product.material;
  document.querySelector("#product-series").textContent = product.series;

  /*
    Наличие и состояние кнопки.
  */
  const status = document.querySelector("#product-status");

  status.classList.toggle("product-status--available", product.available);
  status.classList.toggle("product-status--unavailable", !product.available);
  status.textContent = product.available ? "● В наличии" : "● Нет в наличии";

  addButton.disabled = !product.available;

  if (!product.available) {
    addButton.textContent = "Нет в наличии";
  }

  /*
    Добавление в корзину.
  */
  addButton.addEventListener("click", () => {
    const quantity = Cart.add(productId, product);

    Dom.setMessage(
      cartMessage,
      `«${product.title}» добавлен в корзину. В корзине: ${quantity} шт.`,
      "success"
    );
  });
})();
