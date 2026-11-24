/*
  Карточка товара.

  Один и тот же код собирает карточки и в каталоге, и на главной странице,
  поэтому разметка не дублируется в HTML. Все данные (название, описание,
  характеристики) выводятся через textContent — безопасно.
*/

const ProductCard = (() => {
  //Классы бейджей по подписи товара.
  const BADGE_CLASSES = {
    Новинка: "product-card__badge--new",
    Хит: "product-card__badge--hit",
    Лимитка: "product-card__badge--limited",
  };

  /*
    Изображение с набором размеров для адаптивности.
    Карточка каталога занимает разную долю экрана, поэтому sizes
    повторяет значения из прежней вёрстки.
  */
  function createImage(product) {
    const image = Dom.create("img", "product-card__image");

    image.src = product.image;
    image.alt = product.imageAlt;
    image.width = product.imageWidth;
    image.height = product.imageHeight;
    image.loading = "lazy";
    image.decoding = "async";

    if (product.imageSet) {
      const { path, ext, widths } = product.imageSet;

      image.srcset = widths.map((width) => `${path}-${width}.${ext} ${width}w`).join(", ");
    }

    image.sizes =
      "(max-width: 575px) 72vw, (max-width: 767px) 46vw, (max-width: 1199px) 26vw, 22vw";

    return image;
  }

  /*
    Бейдж «Новинка» / «Хит» / «Лимитка».
    Если бейджа нет, возвращается null — пустой плашки не будет.
  */
  function createBadge(product) {
    if (!product.badge) {
      return null;
    }

    const badge = Dom.create("span", "product-card__badge", product.badge);

    badge.classList.add("product-card__badge--new");

    const modifier = BADGE_CLASSES[product.badge];

    if (modifier) {
      badge.classList.remove("product-card__badge--new");
      badge.classList.add(modifier);
    }

    return badge;
  }

  /*
    Список характеристик карточки.
  */
  function createSpecs(specs) {
    const list = Dom.create("ul", "product-card__specs");

    specs.forEach((spec) => {
      list.append(Dom.create("li", null, spec));
    });

    return list;
  }

  /*
    Собирает карточку товара.

    id      — ключ товара, нужен для ссылки на страницу товара;
    product — объект с данными из js/products.js.
  */
  function create(id, product) {
    const card = Dom.create("article", "product-card");

    const imageWrapper = Dom.create("div", "product-card__image-wrapper");
    imageWrapper.append(createImage(product));

    const badge = createBadge(product);

    if (badge) {
      imageWrapper.append(badge);
    }

    const title = Dom.create("h3", "product-card__title", product.title);

    const link = Dom.create("a", "button button--outline product-card__link", "Подробнее");
    link.href = `product.html?id=${encodeURIComponent(id)}`;

    card.append(
      imageWrapper,
      Dom.create("p", "product-card__category", product.collection),
      title,
      Dom.create("p", "product-card__description", product.tagline),
      createSpecs(product.cardSpecs),
      Dom.create("p", "product-card__price", Dom.formatPrice(product.price)),
      link
    );

    return card;
  }

  return { create };
})();
