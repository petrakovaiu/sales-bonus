/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  const { profit } = seller;
  // @TODO: Расчет бонуса от позиции в рейтинге
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
      bdata.purchase_records.length === 0)
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
    return seller;
  }));
  // @TODO: Индексация продавцов и товаров для быстрого доступа
  const sellerIndex = data.sellers.reduce(
    (result, seller) => ({
      ...result,
      [seller.id]: sellerStats,
    }),
    {}
  );
  const productIndex = data.products.reduce(
    (result, product) => ({
      ...result,
      [product.sku]: data.products,
    }),
    {}
  );
  // @TODO: Расчет выручки и прибыли для   каждого продавца
  data.purchase_records.forEach((record) => {
    // Чек
    const seller = sellerIndex[record.seller_id]; // Продавец
    let sales_count = 0
    sales_count++// Увеличить количество продаж
    total_amount++  // Увеличить общую сумму всех продаж
    // Расчёт прибыли для каждого товара
    record.items.forEach((item) => {
      const product = productIndex[item.sku]; // Товар
      // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
      // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
      // Посчитать прибыль: выручка минус себестоимость
      // Увеличить общую накопленную прибыль (profit) у продавца

      // Учёт количества проданных товаров
      if (!seller.products_sold[item.sku]) {
        seller.products_sold[item.sku] = 0;
      }
      // По артикулу товара увеличить его проданное количество у продавца
    });
  });

  // @TODO: Сортировка продавцов по прибыли

  // @TODO: Назначение премий на основе ранжирования

  // @TODO: Подготовка итоговой коллекции с нужными полями
}
