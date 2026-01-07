/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  if (sale_price == null || quantity == null) {
    throw new Error("Некорректные данные покупки");
  }

  if (sale_price < 0 || quantity <= 0) {
    throw new Error("Цена или количество некорректны");
  }

  if (discount < 0 || discount > 100) {
    throw new Error("Скидка должна быть от 0 до 100%");
  }
  const itemDicsount = 1 - discount / 100;
  const revenue = sale_price * quantity * itemDicsount;
  return revenue;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
// @TODO: Расчет бонуса от позиции в рейтинге
function calculateBonusByProfit(index, total, seller) {
  const { profit } = seller;
  //const total = sellerStats.length - 1;
  if (index === 0) {
    return profit * 0.15;
  } else if (index === 1 && index === 2) {
    return profit * 0.1;
  } else if (index === total - 1) {
    return 0;
  } else {
    // Для всех остальных
    return profit * 0.05;
  }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  //@TODO: Проверка входных данных
  if (
    !data ||
    (!Array.isArray(data.sellers) &&
      !Array.isArray(data.products) &&
      !Array.isArray(data.purchase_records)) ||
    (data.sellers.length === 0 &&
      data.products.length === 0 &&
      data.purchase_records.length === 0)
  ) {
    throw new Error("Некорректные входные данные");
  }
  // @TODO: Проверка наличия опций
  const { calculateRevenue } = options; // Сюда передадим функции для расчётов
  //!!Разобраться с именами переменных, что туда класть!!
  if (!data || !options) {
    throw new Error("Чего-то не хватает");
  }

  typeof calculateRevenue === "function";
  typeof calculateBonus === "function";
  // @TODO: Подготовка промежуточных данных для сбора статистики
  const sellerStats = data.sellers.map((seller) => ({
    id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {},
  }));
  //@TODO: Индексация продавцов и товаров для быстрого доступа
  const sellerIndex = data.sellers.reduce(
    (result, seller, index) => ({
      ...result,
      [seller.id]: sellerStats[index],
    }),
    {}
  );
  const productIndex = data.products.reduce(
    (result, product, index) => ({
      ...result,
      [product.sku]: data.products[index],
    }),
    {}
  );
  //@TODO: Расчет выручки и прибыли для   каждого продавца
  data.purchase_records.forEach((record) => {
    // Чек
    const seller = sellerIndex[record.seller_id]; // Продавец
    seller.sales_count += 1; // Увеличить количество продаж
    seller.revenue += record.total_amount - record.total_discount; // Увеличить общую сумму выручки всех продаж
    //Расчёт прибыли для каждого товара
    record.items.forEach((item) => {
      const product = productIndex[item.sku]; // Товар
      const cost = product.purchase_price * item.quantity; // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
      const itemRevenue = calculateSimpleRevenue(item, product); // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
      // Посчитать прибыль: выручка минус себестоимость
      seller.profit += itemRevenue - cost; // Увеличить общую накопленную прибыль (profit) у продавца
      // Учёт количества проданных товаров
      if (!seller.products_sold[item.sku]) {
        seller.products_sold[item.sku] = 0;
      }
      seller.products_sold[item.sku]++; // По артикулу товара увеличить его проданное количество у продавца
    });
  });

  // @TODO: Сортировка продавцов по прибыли
  sellerStats.sort((a, b) => {
    if (b.profit < a.profit) {
      return -1;
    }
    if (b.profit > a.profit) {
      return 1;
    }
    return 0;
  });

  // @TODO: Назначение премий на основе ранжирования
  sellerStats.forEach((seller, index) => {
    const total = sellerStats.length;
    seller.bonus = calculateBonusByProfit(index, total, seller); // Считаем бонус
    // Формируем топ-10 товаров
    seller.top_products = Object.entries(seller.products_sold)
      .map(([sku, quantity]) => ({
        sku,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  });
  // @TODO: Подготовка итоговой коллекции с нужными полями
  return sellerStats.map((seller) => ({
    seller_id: seller.id, // Строка, идентификатор продавца
    name: seller.name, // Строка, имя продавца
    revenue: +seller.revenue.toFixed(2), // Число с двумя знаками после точки, выручка продавца
    profit: +seller.profit.toFixed(2), // Число с двумя знаками после точки, прибыль продавца
    sales_count: +seller.sales_count.toFixed(2), // Целое число, количество продаж продавца
    top_products: seller.top_products, // Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
    bonus: +seller.bonus.toFixed(2), // Число с двумя знаками после точки, бонус продавца
  }));
}
