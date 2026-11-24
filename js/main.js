/*
  Главная страница: модальное окно предзаказа и форма заявки.

  Оба окна построены на нативном <dialog>, поэтому браузер сам удерживает
  фокус внутри окна и закрывает его по Escape. Сообщения об ошибках
  и об успешной отправке выводятся текстом на странице, без alert().
*/

(() => {
  /*
    Окно предзаказа.
  */
  const preorderDialog = document.querySelector("#preorder-modal");
  const preorderOpenButton = document.querySelector("#preorder-open");
  const preorderCloseButton = document.querySelector("#preorder-close");
  const preorderDismissButtons = document.querySelectorAll("[data-preorder-close]");

  if (preorderDialog && preorderOpenButton) {
    preorderOpenButton.addEventListener("click", () => {
      preorderDialog.showModal();
    });

    if (preorderCloseButton) {
      preorderCloseButton.addEventListener("click", () => {
        preorderDialog.close();
      });
    }

    preorderDismissButtons.forEach((button) => {
      button.addEventListener("click", () => {
        preorderDialog.close();
      });
    });

    //Клик по затемнённой области вокруг окна тоже закрывает его.
    preorderDialog.addEventListener("click", (event) => {
      if (event.target === preorderDialog) {
        preorderDialog.close();
      }
    });
  }

  /*
    Окно заявки на товар.
  */
  const orderDialog = document.querySelector("#order-dialog");
  const orderForm = document.querySelector("#order-form");
  const orderButtons = document.querySelectorAll(".product-card__button");
  const closeDialogButton = document.querySelector("#close-order-dialog");
  const selectedProductInput = document.querySelector("#selected-product");
  const selectedProductHint = document.querySelector("#selected-product-name");
  const formMessage = document.querySelector("#order-form-message");

  if (!orderDialog || !orderForm) {
    return;
  }

  const validation = FormValidation.initForm(orderForm);

  /*
    Кнопки «Заказать» в карточках главной страницы.
  */
  orderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product || "";

      selectedProductInput.value = productName;
      selectedProductHint.textContent = productName;

      //Новое открытие окна не должно показывать прошлые сообщения.
      Dom.setMessage(formMessage, "", "info");
      validation.clear();

      orderDialog.showModal();
    });
  });

  if (closeDialogButton) {
    closeDialogButton.addEventListener("click", () => {
      orderDialog.close();
    });
  }

  /*
    Отправка формы: сначала проверка полей, затем сообщение об успехе.
    Серверной части в учебном проекте нет, поэтому event.preventDefault().
  */
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    Dom.setMessage(formMessage, "", "info");

    if (!validation.validate()) {
      Dom.setMessage(
        formMessage,
        "Проверьте выделенные поля и отправьте заявку ещё раз.",
        "error"
      );
      return;
    }

    const name = orderForm.querySelector("#order-name").value.trim();

    orderDialog.close();
    orderForm.reset();
    validation.clear();

    const successMessage = document.querySelector("#success-message");

    Dom.setMessage(
      successMessage,
      `${name}, заявка отправлена! Свяжемся с вами в рабочее время.`,
      "success"
    );

    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
