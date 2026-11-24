/*
  Корзина: чтение, запись и изменения в localStorage.

  Модуль используют страница товара и страница корзины.
  После каждого изменения он отправляет событие cartUpdated,
  по которому счётчик в шапке пересчитывается.
*/

const Cart = (() => {
  const STORAGE_KEY = "cart";
  const UPDATE_EVENT = "cartUpdated";

  /*
    Читает корзину из localStorage.
    Если данных нет или они повреждены, возвращается пустой массив —
    страница не должна ломаться из-за испорченного хранилища.
  */
  function read() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  }

  /*
    Сохраняет корзину и сообщает об этом остальным частям интерфейса.
  */
  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }

  /*
    Общее количество единиц товара — для счётчика в шапке.
  */
  function getTotalQuantity() {
    return read().reduce((sum, item) => sum + item.quantity, 0);
  }

  /*
    Общая стоимость корзины.
  */
  function getTotalPrice() {
    return read().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /*
    Добавляет товар: новую позицию создаёт, у существующей увеличивает
    количество.
  */
  function add(productId, product) {
    const items = read();
    const existing = items.find((item) => item.id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: productId,
        title: product.title,
        price: product.price,
        /*
          В корзине картинка показывается маленькой, поэтому кладём
          уменьшенный вариант, а не крупный файл основного изображения.
        */
        image: product.imageThumb || product.image,
        quantity: 1,
      });
    }

    write(items);

    return existing ? existing.quantity : 1;
  }

  /*
    Меняет количество позиции на delta (+1 / −1).
    Если количество опускается до нуля, позиция удаляется.
  */
  function changeQuantity(productId, delta) {
    const items = read();
    const product = items.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    product.quantity += delta;

    const updated = product.quantity > 0
      ? items
      : items.filter((item) => item.id !== productId);

    write(updated);
  }

  /*
    Удаляет одну позицию.
  */
  function remove(productId) {
    write(read().filter((item) => item.id !== productId));
  }

  /*
    Полностью очищает корзину.
  */
  function clear() {
    write([]);
  }

  return {
    read,
    add,
    changeQuantity,
    remove,
    clear,
    getTotalQuantity,
    getTotalPrice,
    UPDATE_EVENT,
  };
})();
