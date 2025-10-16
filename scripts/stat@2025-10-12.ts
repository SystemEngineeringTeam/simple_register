import type { OmitStrict } from "@/types/utils";

type ItemId
  = | "oqlepx24xm8ktgt8nrx9tpje"
    | "rewzi8gl3niybtniael3uc9r"
    | "wfw50wz1z38z3jo0jqci3hfb"
    | "bdxpj17blx4jza95ii92zxdm"
    | "n1rbanpsl0s6jfn223y3j5cr"
    | "ke03npycplggquox4ge694hk"
    | "y9ojznta5r3cs3un59lwpiow"
    | "d4yc9h64cixo921ybzntcgf7"
    | "p92trulfts7pz8pgiisehpmu"
    | "uqwhams80qhqk99xdeo9i79n"
    | "rgo5yg85cn4mwn33bug1hcvv"
    | "m8gqxv1kamut7ernwoxhdexf";

type Order = {
  id: string;
  receiptNumber: number;
  createdAt: string;
  status: string;
  statusChange: Array<{
    to: string;
    at: string;
  }>;
  items: Array<{
    id: ItemId;
    name: string;
    price: number;
    amount: number;
  }>;
  depositAmount: number;
  appliedDiscount?: {
    id: string;
    name: string;
    amount: Record<ItemId, number>;
  };
};

function calcTotal(order: Order): number {
  const itemsWithDiscount = order.items.map((item) => {
    if (order.appliedDiscount == null) {
      return item;
    }

    const discountAmount = order.appliedDiscount.amount[item.id] ?? 0;
    const discountedPrice = Math.max(item.price - discountAmount, 0);
    return { ...item, price: discountedPrice };
  });

  const total = itemsWithDiscount.reduce((sum, item) => sum + item.price * item.amount, 0);
  return total;
}

function appliedDiscount(order: Order): string | undefined {
  return order.appliedDiscount != null ? order.appliedDiscount.id : undefined;
}

function getDiscountedPrice(order: Order, item: Order["items"][number]): number {
  if (order.appliedDiscount == null) {
    return item.price;
  }

  const discountAmount = order.appliedDiscount.amount[item.id] ?? 0;
  return Math.max(item.price - discountAmount, 0);
}

const a = await Bun.file("input/2025-10-12-modified.json").text();
const orders: Order[] = JSON.parse(a);

// order first

const tsvOrderFirst = orders.map((order) => ({
  id: order.id,
  receiptNumber: order.receiptNumber,
  createdAt: order.createdAt,
  items: order.items.map((item) => `${item.name} (x${item.amount})`).join(", "),
  depositAmount: order.depositAmount,
  appliedDiscount: appliedDiscount(order),
  total: calcTotal(order),
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

await Bun.write("out/2025-10-12-order-first.tsv", tsvOrderFirstString);

// item first
type ItemFirstRow = {
  itemName: string;
  totalAmount: number;
  totalSales: number;
};

const itemMap = new Map<string, OmitStrict<ItemFirstRow, "itemName">>();

for (const order of orders) {
  for (const item of order.items) {
    const discountedPrice = getDiscountedPrice(order, item);
    if (!itemMap.has(item.name)) {
      itemMap.set(item.name, { totalAmount: 0, totalSales: 0 });
    }
    const entry = itemMap.get(item.name)!;
    entry.totalAmount += item.amount;
    entry.totalSales += discountedPrice * item.amount;
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

await Bun.write("out/2025-10-12-item-first.tsv", tsvItemFirstString);

// discountApplied !=== (参加者割引) な item first

const noDiscountItemMap = new Map<string, OmitStrict<ItemFirstRow, "itemName">>();

for (const order of orders) {
  if (order.appliedDiscount?.id !== "d0preu8uj5nxabuzccvqexe7") {
    for (const item of order.items) {
      const discountedPrice = getDiscountedPrice(order, item);
      if (!noDiscountItemMap.has(item.name)) {
        noDiscountItemMap.set(item.name, { totalAmount: 0, totalSales: 0 });
      }
      const entry = noDiscountItemMap.get(item.name)!;
      entry.totalAmount += item.amount;
      entry.totalSales += discountedPrice * item.amount;
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

await Bun.write("out/2025-10-12-no-discount-item-first.tsv", tsvNoDiscountItemFirstString);
