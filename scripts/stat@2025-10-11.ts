export type Root = {
  id: string;
  receiptNumber: number;
  createdAt: string;
  status: string;
  statusChange: Array<{
    to: string;
    at: string;
  }>;
  items: Array<{
    id: string;
    name: string;
    price: number;
    amount: number;
  }>;
  depositAmount?: number;
};

type ModifiedRoot = Root & { appliedDiscount: boolean; total: number };

function calcTotal(items: Root["items"]): number {
  return items.reduce((sum, item) => sum + item.price * item.amount, 0);
}

function isAppliedDiscount(items: Root ["items"], depositAmount?: number): boolean {
  if (depositAmount == null) {
    return false;
  }
  const total = calcTotal(items);
  return total > depositAmount;
}

const a = await Bun.file("input/2025-10-11.json").text();
const orders: Root[] = JSON.parse(a);

const modifiedOrders: ModifiedRoot[] = orders.map((order) => ({
  ...order,
  appliedDiscount: isAppliedDiscount(order.items, order.depositAmount),
  total: calcTotal(order.items),
}));

await Bun.write("out/2025-10-11-modified.json", JSON.stringify(modifiedOrders, null, 2));

// order first
const tsvOrderFirst = modifiedOrders.map((order) => ({
  id: order.id,
  receiptNumber: order.receiptNumber,
  createdAt: order.createdAt,
  items: order.items.map((item) => `${item.name} (x${item.amount})`).join(", "),
  depositAmount: order.depositAmount ?? 0,
  appliedDiscount: order.appliedDiscount,
  total: order.total,
}));

const tsvOrderFirstString = [
  ["id", "receiptNumber", "createdAt", "items", "depositAmount", "appliedDiscount", "total"].join("\t"),
  ...tsvOrderFirst.map((order) => [
    order.id,
    order.receiptNumber,
    order.createdAt,
    order.items,
    order.depositAmount,
    order.appliedDiscount,
    order.total,
  ].join("\t")),
].join("\n");

await Bun.write("out/2025-10-11-order-first.tsv", tsvOrderFirstString);

// item first

type ItemFirstRow = {
  itemName: string;
  totalAmount: number;
  totalSales: number;
};

const itemMap = new Map<string, { totalAmount: number; totalSales: number }>();

for (const order of modifiedOrders) {
  for (const item of order.items) {
    if (!itemMap.has(item.name)) {
      itemMap.set(item.name, { totalAmount: 0, totalSales: 0 });
    }
    const entry = itemMap.get(item.name)!;
    entry.totalAmount += item.amount;
    entry.totalSales += item.price * item.amount;
  }
}

const tsvItemFirst: ItemFirstRow[] = Array.from(itemMap.entries()).map(([itemName, { totalAmount, totalSales }]) => ({
  itemName,
  totalAmount,
  totalSales,
}));

const tsvItemFirstString = [
  ["itemName", "totalAmount", "totalSales"].join("\t"),
  ...tsvItemFirst.map((row) => [
    row.itemName,
    row.totalAmount,
    row.totalSales,
  ].join("\t")),
].join("\n");

await Bun.write("out/2025-10-11-item-first.tsv", tsvItemFirstString);

// isDiscountApplied されていない item first
const noDiscountItemMap = new Map<string, { totalAmount: number; totalSales: number }>();

for (const order of modifiedOrders) {
  if (!order.appliedDiscount) {
    for (const item of order.items) {
      if (!noDiscountItemMap.has(item.name)) {
        noDiscountItemMap.set(item.name, { totalAmount: 0, totalSales: 0 });
      }
      const entry = noDiscountItemMap.get(item.name)!;
      entry.totalAmount += item.amount;
      entry.totalSales += item.price * item.amount;
    }
  }
}

const tsvNoDiscountItemFirst: ItemFirstRow[] = Array.from(noDiscountItemMap.entries()).map(([itemName, { totalAmount, totalSales }]) => ({
  itemName,
  totalAmount,
  totalSales,
}));

const tsvNoDiscountItemFirstString = [
  ["itemName", "totalAmount", "totalSales"].join("\t"),
  ...tsvNoDiscountItemFirst.map((row) => [
    row.itemName,
    row.totalAmount,
    row.totalSales,
  ].join("\t")),
].join("\n");

await Bun.write("out/2025-10-11-no-discount-item-first.tsv", tsvNoDiscountItemFirstString);
