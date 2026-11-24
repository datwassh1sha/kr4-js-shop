/*
  Данные товаров — единый источник для каталога и страницы товара.

  Поля изображений:
    image       — основной файл, используется как src (средний размер)
    imageSet    — параметры набора для srcset: папка, имя и список ширин
    imageThumb  — уменьшенный вариант для миниатюры в корзине
    imageWidth  — ширина исходного изображения в пикселях
    imageHeight — высота исходного изображения в пикселях
                  (нужны, чтобы браузер заранее знал пропорции
                   и страница не «прыгала» при загрузке)

  Поля каталога:
    category    — категория для фильтра: new | hit | limited
    collection  — подпись над названием в карточке
    tagline     — короткое описание для карточки
    cardSpecs   — характеристики, которые показываются в карточке

  Карточки каталога не хранятся в HTML: они собираются из этих данных
  в js/product-card.js, а текст выводится через textContent.
*/

const products = {
  "porsche-930-rwb-silhouettes": {
    title: "RWB Porsche 930",
    price: 1000,
    category: "new",
    collection: "Premium",
    tagline:
      "Икона стиля, созданная мастером RWB Акирой Накаи — RWB Porsche 930!",
    cardSpecs: ["Бренд: Porsche", "Серия: Silhouettes", "Год выпуска: 2025"],
    image: "images/products/rwb-930-800.webp",
    imageSet: {
      path: "images/products/rwb-930",
      ext: "webp",
      widths: [320, 400, 640, 800, 1000],
    },
    imageThumb: "images/products/rwb-930-400.webp",
    imageWidth: 1000,
    imageHeight: 1140,
    imageAlt: "Белая модель RWB Porsche 930 Hot Wheels",
    badge: "Новинка",
    available: true,

    shortDescription:
      "Белая RWB Porsche 930 с широким кузовным обвесом — выразительная модель для поклонников модифицированных Porsche.",

    description:
      "RWB Porsche 930 Silhouettes — коллекционная модель Porsche с характерным широким кузовом в стиле Rauh-Welt Begriff. Белая окраска подчёркивает расширенные арки, низкую посадку и агрессивный силуэт автомобиля.",

    manufacturer: "Hot Wheels",
    scale: "1:64",
    material: "Metal/Metal",
    series: "Silhouettes",
  },

  "porsche-917kh-gulf": {
    title: "Porsche 917KH Gulf",
    price: 1500,
    category: "limited",
    collection: "Premium",
    tagline:
      "Прикоснись к гоночной легенде с моделью Porsche 917KH в культовой ливрее Gulf!",
    cardSpecs: ["Бренд: Porsche", "Серия: Circuit Legends", "Год выпуска: 2025"],
    image: "images/products/917kh-800.webp",
    imageSet: {
      path: "images/products/917kh",
      ext: "webp",
      widths: [320, 400, 640, 800, 1000],
    },
    imageThumb: "images/products/917kh-400.webp",
    imageWidth: 1000,
    imageHeight: 1180,
    imageAlt: "Модель Porsche 917KH Hot Wheels в гоночной ливрее Gulf",
    badge: "Лимитка",
    available: true,

    shortDescription:
      "Porsche 917KH в культовой гоночной ливрее Gulf — легендарный силуэт автоспорта в коллекционном масштабе.",

    description:
      "Porsche 917KH Circuit Legends в фирменной расцветке Gulf вдохновлена гоночными Porsche, прославившимися на трассах в эпоху гонок на выносливость. Контрастные голубой и оранжевый цвета делают модель особенно узнаваемой и эффектной в коллекции Hot Wheels.",

    manufacturer: "Hot Wheels",
    scale: "1:64",
    material: "Metal/Metal",
    series: "Circuit Legends",
  },

  "porsche-carrera-gt": {
    title: "Porsche Carrera GT",
    price: 2000,
    category: "hit",
    collection: "Premium",
    tagline: "Почувствуй скорость и азарт с моделью Porsche Carrera GT!",
    cardSpecs: ["Бренд: Porsche", "Серия: Timeless Icons", "Год выпуска: 2025"],
    image: "images/products/carrera-gt-800.webp",
    imageSet: {
      path: "images/products/carrera-gt",
      ext: "webp",
      widths: [320, 400, 640, 800, 1000],
    },
    imageThumb: "images/products/carrera-gt-400.webp",
    imageWidth: 1000,
    imageHeight: 1246,
    imageAlt: "Жёлтая модель Porsche Carrera GT Hot Wheels",
    badge: "Хит",
    available: true,

    shortDescription:
      "Жёлтая Porsche Carrera GT из серии Timeless Icons — миниатюрное воплощение одного из самых узнаваемых суперкаров Porsche. Яркий кузов Fayence Yellow, проработанные элементы экстерьера и премиальное исполнение делают модель эффектным дополнением коллекции Hot Wheels.",

    description:
      "Porsche Carrera GT — легендарный суперкар с атмосферным V10 и выразительным среднемоторным силуэтом. В серии Hot Wheels Premium Car Culture: Timeless Icons модель получила насыщенный жёлтый цвет Fayence Yellow, затемнённые стёкла, детализированные фары и задние фонари, а также фирменные колёса Real Riders. Металлический кузов и металлическое шасси подчёркивают премиальный характер модели. Выпуск под номером 3/5 входит в серию Timeless Icons 2025 года и подойдёт как поклонникам Porsche, так и коллекционерам масштабных моделей 1:64.",

    manufacturer: "Hot Wheels",
    scale: "1:64",
    material: "Metal/Metal",
    series: "Car Culture: Timeless Icons",
  },

  "nissan-skyline-r34-rlc": {
    title: "Nissan Skyline GT-R (R34)",
    price: 10000,
    category: "limited",
    collection: "RLC Exclusive",
    tagline:
      "Красная JDM-легенда в коллекционном исполнении RLC Selections.",
    cardSpecs: ["Бренд: Nissan", "Серия: RLC Selections", "Год выпуска: 2026"],
    image: "images/products/skyline-r34-640.jpg",
    imageSet: {
      path: "images/products/skyline-r34",
      ext: "jpg",
      widths: [320, 480, 640, 739],
    },
    imageThumb: "images/products/skyline-r34-480.jpg",
    imageWidth: 739,
    imageHeight: 415,
    imageAlt: "Красный Nissan Skyline GT-R R34 из серии RLC Selections",
    badge: "Лимитка",
    available: false,

    shortDescription:
      "Красный Nissan Skyline GT-R (R34) от RLC Selections — культовая JDM-легенда в коллекционном исполнении. Модель доступна по предзаказу.",

    description:
      "Nissan Skyline GT-R (R34) в исполнении RLC Selections повторяет облик одного из самых известных японских спорткаров. Модель выполнена в насыщенном красном цвете, получила детализированную оптику, характерный задний спойлер и коллекционное оформление. Партия ограничена, поэтому модель доступна только по предзаказу.",

    manufacturer: "Hot Wheels",
    scale: "1:64",
    material: "Metal/Metal",
    series: "RLC Selections",
  },
};
