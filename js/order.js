/*
  Страница корзины: список позиций, итог, очистка и оформление заказа.

  Позиции не прописаны в HTML — они собираются из корзины в localStorage
  через createElement и append. Все тексты (названия, суммы, сообщения)
  выводятся через textContent.
*/

(() => {
  const cartList = document.querySelector("#cart-items");

  //Модуль подключается только на странице корзины.
  if (!cartList) {
    return;
  }

  const cartEmpty = document.querySelector("#cart-empty");
  const cartSummary = document.querySelector("#cart-summary");
  const cartTotal = document.querySelector("#cart-total");
  const clearCartButton = document.querySelector("#clear-cart");
  const orderForm = document.querySelector("#order-form");
  const orderMessage = document.querySelector("#order-message");

  /*
    Строка с единицей: стоимость одной позиции.
  */
  function createCartItem(item) {
    const total = item.price * item.quantity;

    const cartItem = Dom.create("article", "cart-item");

    const image = Dom.create("img", "cart-item__image");
    image.src = item.image;
    image.alt = item.title;
    image.loading = "lazy";
    image.decoding = "async";

    const info = Dom.create("div", "cart-item__info");
    info.append(
      Dom.create("h2", "cart-item__title", item.title),
      Dom.create("p", "cart-item__unit-price", `${item.price} ₽ за штуку`)
    );

    const quantityColumn = Dom.create("div", "cart-item__quantity");

    const decreaseButton = Dom.create(
      "button",
      "button button--icon",
      "−"
    );
    decreaseButton.type = "button";
    decreaseButton.setAttribute("aria-label", `Уменьшить количество: ${item.title}`);

    const quantity = Dom.create("span", "cart-item__count", item.quantity);

    const increaseButton = Dom.create("button", "button button--icon", "+");
    increaseButton.type = "button";
    increaseButton.setAttribute("aria-label", `Увеличить количество: ${item.title}`);

    decreaseButton.addEventListener("click", () => {
      Cart.changeQuantity(item.id, -1);
    });

    increaseButton.addEventListener("click", () => {
      Cart.changeQuantity(item.id, 1);
    });

    quantityColumn.append(decreaseButton, quantity, increaseButton);

    const totalColumn = Dom.create("div", "cart-item__total");
    totalColumn.append(
      Dom.create("p", "cart-item__sum", Dom.formatPrice(total)),
      createRemoveButton(item)
    );

    cartItem.append(image, info, quantityColumn, totalColumn);

    return cartItem;
  }

  /*
    Кнопка удаления одной позиции.
  */
  function createRemoveButton(item) {
    const button = Dom.create("button", "button button--danger-outline", "Удалить");
    button.type = "button";
    button.setAttribute("aria-label", `Удалить из корзины: ${item.title}`);

    button.addEventListener("click", () => {
      Cart.remove(item.id);
    });

    return button;
  }

  /*
    Перечисляет позиции и пересчитает итог.
  */
  function renderCart() {
    const cart = Cart.read();

    Dom.clear(cartList);

    cart.forEach((item) => {
      cartList.append(createCartItem(item));
    });

    //Знак рубля стоит в разметке рядом с числом, поэтому выводим только сумму.
    cartTotal.textContent = Cart.getTotalPrice().toLocaleString("ru-RU");
    cartEmpty.hidden = cart.length > 0;
    cartSummary.hidden = cart.length === 0;
  }

  clearCartButton.addEventListener("click", () => {
    Cart.clear();
    Dom.setMessage(orderMessage, "", "info");
  });

  //Перерисовываем корзину при любом её изменении (в этой или другой вкладке).
  window.addEventListener(Cart.UPDATE_EVENT, renderCart);
  window.addEventListener("storage", renderCart);

  /*
    Валидация и отправка формы заказа.
  */
  const validation = FormValidation.initForm(orderForm);

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    //Сбрасываем предыдущие сообщения.
    Dom.setMessage(orderMessage, "", "info");

    //Если корзина пуста, ошибок полей не задано — сообщаем прямо здесь.
    if (Cart.read().length === 0) {
      Dom.setMessage(orderMessage, "Добавьте товары в корзину.", "error");
      return;
    }

    if (!validation.validate()) {
      //Чтобы не уписывать пользователя в молчание, показываем общий текст.
      Dom.setMessage(
        orderMessage,
        "Проверьте выделенные поля и отправьте заказ ещё раз.",
        "error"
      );
      return;
    }

    const name = orderForm.querySelector("#customer-name").value.trim();

    Dom.setMessage(
      orderMessage,
      `Спасибо, ${name}! Заказ успешно оформлен.`,
      "success"
    );

    Cart.clear();
    orderForm.reset();
    validation.clear();
  });

  //Показываем сохранённую корзину при открытии страницы.
  renderCart();
})();
