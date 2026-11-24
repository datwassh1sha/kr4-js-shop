/*
  Счётчик товаров в шапке сайта.

  Подключается на всех страницах. Число берётся из корзины через модуль
  js/cart.js, поэтому формат хранения описан в одном месте.
*/

(() => {
  const counter = document.querySelector("#cart-count");

  if (!counter) {
    return;
  }

  function renderCounter() {
    const total = Cart.getTotalQuantity();

    counter.textContent = total;
    //Пустая корзина — счётчик прячется, чтобы не мешать навигации.
    counter.classList.toggle("cart-badge--empty", total === 0);
  }

  renderCounter();

  //Любое изменение корзины обновляет счётчик.
  window.addEventListener(Cart.UPDATE_EVENT, renderCounter);

  //Изменения в другой вкладке браузера тоже учитываются.
  window.addEventListener("storage", (event) => {
    if (event.key === "cart") {
      renderCounter();
    }
  });
})();
