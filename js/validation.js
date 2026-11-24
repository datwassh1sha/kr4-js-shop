/*
  Валидация форм.

  Проверка опирается на встроенные ограничения HTML (required, type,
  minlength, pattern …), но сообщения выводятся не всплывающими окнами
  браузера, а текстом под полем. Поэтому в разметке форм стоит novalidate.

  Каждое поле получает:
    aria-invalid="true"              — подсветка ошибки в CSS;
    элемент <p class="form-field__error"> — текст ошибки;
    aria-describedby                 — связь поля с текстом ошибки
                                       для скринридеров.
*/

const FormValidation = (() => {
  /*
    Текст ошибки для одного поля.
    Возвращает пустую строку, если поле заполнено верно.
  */
  function getErrorMessage(field) {
    const { validity } = field;

    if (validity.valid) {
      return "";
    }

    //Собственный текст поля: <input data-error-message="…" />
    const customMessage = field.dataset.errorMessage;

    if (validity.valueMissing) {
      if (field.type === "checkbox") {
        return "Отметьте этот пункт, чтобы продолжить.";
      }

      //Свой текст из data-error-message важнее общего.
      return customMessage || "Заполните это поле.";
    }

    if (validity.typeMismatch) {
      if (field.type === "email") {
        return customMessage || "Введите адрес в формате name@example.com.";
      }

      return "Проверьте формат значения.";
    }

    if (validity.patternMismatch) {
      return field.dataset.patternMessage || "Значение не соответствует формату.";
    }

    if (validity.tooShort) {
      return `Введите не меньше ${field.minLength} символов.`;
    }

    if (validity.tooLong) {
      return `Введите не больше ${field.maxLength} символов.`;
    }

    if (validity.rangeUnderflow) {
      return `Минимальное значение — ${field.min}.`;
    }

    if (validity.rangeOverflow) {
      return `Максимальное значение — ${field.max}.`;
    }

    if (validity.stepMismatch) {
      return "Введите корректное значение.";
    }

    return customMessage || "Проверьте значение поля.";
  }

  /*
    Блок, в который попадает текст ошибки: ближайшая обёртка поля.
  */
  function getFieldContainer(field) {
    return (
      field.closest(".form-field, .order-form__field, .filters-form__group") ||
      field.parentElement
    );
  }

  /*
    Создаёт (один раз) элемент для текста ошибки и связывает его с полем.
  */
  function getErrorElement(field) {
    if (!field.id) {
      return null;
    }

    const errorId = `${field.id}-error`;
    const existing = document.getElementById(errorId);

    if (existing) {
      return existing;
    }

    const container = getFieldContainer(field);

    const error = Dom.create("p", "form-field__error");
    error.id = errorId;
    error.hidden = true;
    // role="alert" — скринридер озвучит текст, как только он появится.
    error.setAttribute("role", "alert");

    const describedBy = (field.getAttribute("aria-describedby") || "")
      .split(" ")
      .filter((id) => id && id !== errorId)
      .concat(errorId)
      .join(" ");

    field.setAttribute("aria-describedby", describedBy);
    container.append(error);

    return error;
  }

  /*
    Показывает ошибку под конкретным полем.
  */
  function showFieldError(field, message) {
    field.setAttribute("aria-invalid", "true");

    const error = getErrorElement(field);

    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  /*
    Убирает ошибку под полем.
  */
  function clearFieldError(field) {
    field.removeAttribute("aria-invalid");

    const error = getErrorElement(field);

    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
  }

  /*
    Проверяет одно поле и сразу показывает или убирает текст ошибки.
    Возвращает true, если поле заполнено верно.
  */
  function validateField(field) {
    const message = getErrorMessage(field);

    if (message) {
      showFieldError(field, message);
      return false;
    }

    clearFieldError(field);
    return true;
  }

  /*
    Подключает валидацию к форме.

    Возвращает объект с методами:
      validate() — проверить всю форму и перевести фокус к первой ошибке;
      clear()    — снять все отметки об ошибках.

    Поле проверяется при уходе из него, а если оно уже помечено ошибкой —
    сразу при вводе. Пользователь видит результат без лишних сообщений.
  */
  function initForm(form) {
    // Отключаем нативные всплывающие подсказки браузера.
    form.noValidate = true;

    const fields = Array.from(form.elements).filter(
      (element) => element.willValidate
    );

    function validate() {
      let firstInvalidField = null;

      fields.forEach((field) => {
        const isValid = validateField(field);

        if (!isValid && !firstInvalidField) {
          firstInvalidField = field;
        }
      });

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return !firstInvalidField;
    }

    function clear() {
      fields.forEach((field) => clearFieldError(field));
    }

    fields.forEach((field) => {
      // Проверяем поле, когда пользователь закончил с ним работать.
      field.addEventListener("blur", () => {
        if (field.value !== "" || field.type === "checkbox") {
          validateField(field);
        }
      });

      // И следим за исправлением уже показанной ошибки.
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });

      field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    return { validate, clear, fields };
  }

  return { initForm, validateField, showFieldError, clearFieldError, getErrorMessage };
})();
