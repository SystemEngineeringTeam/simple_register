/* cSpell:disable */

import { createId } from "@paralleldrive/cuid2";
import { Order } from "@/types/order";

export const SAMPLE_ORDERS: Order[] = [
  Order.assert({
    id: createId(),
    receiptNumber: 1,
    createdAt: new Date("2025-10-04T09:30:00.000Z").toISOString(),
    status: "PICKED_UP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T09:30:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T09:35:00.000Z").toISOString(),
      },
      {
        to: "PICKED_UP",
        at: new Date("2025-10-04T09:40:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "oqlepx24xm8ktgt8nrx9tpje",
        name: "塩",
        price: 150,
        amount: 1,
      },
      {
        id: "m5nidhr02wvgzvel38u5ws8p",
        name: "ファンタ",
        price: 100,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 2,
    createdAt: new Date("2025-10-04T09:45:00.000Z").toISOString(),
    status: "PICKED_UP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T09:45:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T09:50:00.000Z").toISOString(),
      },
      {
        to: "PICKED_UP",
        at: new Date("2025-10-04T09:55:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "rewzi8gl3niybtniael3uc9r",
        name: "カレー",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 3,
    createdAt: new Date("2025-10-04T10:00:00.000Z").toISOString(),
    status: "PICKED_UP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:00:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T10:05:00.000Z").toISOString(),
      },
      {
        to: "PICKED_UP",
        at: new Date("2025-10-04T10:10:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "ke03npycplggquox4ge694hk",
        name: "コーラ",
        price: 100,
        amount: 2,
      },
      {
        id: "p92trulfts7pz8pgiisehpmu",
        name: "アクエリ",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 4,
    createdAt: new Date("2025-10-04T10:15:00.000Z").toISOString(),
    status: "WAITING_COOKING",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:15:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "wfw50wz1z38z3jo0jqci3hfb",
        name: "キャラメル",
        price: 150,
        amount: 2,
      },
      {
        id: "d4yc9h64cixo921ybzntcgf7",
        name: "チルソン",
        price: 150,
        amount: 3,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 5,
    createdAt: new Date("2025-10-04T10:20:00.000Z").toISOString(),
    status: "WAITING_COOKING",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:20:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "oqlepx24xm8ktgt8nrx9tpje",
        name: "塩",
        price: 150,
        amount: 3,
      },
      {
        id: "rewzi8gl3niybtniael3uc9r",
        name: "カレー",
        price: 150,
        amount: 1,
      },
      {
        id: "m5nidhr02wvgzvel38u5ws8p",
        name: "ファンタ",
        price: 100,
        amount: 2,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 6,
    createdAt: new Date("2025-10-04T10:25:00.000Z").toISOString(),
    status: "WAITING_COOKING",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:25:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "ke03npycplggquox4ge694hk",
        name: "コーラ",
        price: 100,
        amount: 1,
      },
      {
        id: "wfw50wz1z38z3jo0jqci3hfb",
        name: "キャラメル",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 7,
    createdAt: new Date("2025-10-04T10:30:00.000Z").toISOString(),
    status: "WAITING_PICKUP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:30:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T10:35:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "d4yc9h64cixo921ybzntcgf7",
        name: "チルソン",
        price: 150,
        amount: 4,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 8,
    createdAt: new Date("2025-10-04T10:35:00.000Z").toISOString(),
    status: "WAITING_PICKUP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:35:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T10:40:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "oqlepx24xm8ktgt8nrx9tpje",
        name: "塩",
        price: 150,
        amount: 2,
      },
      {
        id: "rewzi8gl3niybtniael3uc9r",
        name: "カレー",
        price: 150,
        amount: 2,
      },
      {
        id: "p92trulfts7pz8pgiisehpmu",
        name: "アクエリ",
        price: 150,
        amount: 3,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 9,
    createdAt: new Date("2025-10-04T10:40:00.000Z").toISOString(),
    status: "WAITING_PICKUP",
    statusChange: [
      {
        to: "WAITING_COOKING",
        at: new Date("2025-10-04T10:40:00.000Z").toISOString(),
      },
      {
        to: "WAITING_PICKUP",
        at: new Date("2025-10-04T10:45:00.000Z").toISOString(),
      },
    ],
    items: [
      {
        id: "m5nidhr02wvgzvel38u5ws8p",
        name: "ファンタ",
        price: 100,
        amount: 3,
      },
      {
        id: "ke03npycplggquox4ge694hk",
        name: "コーラ",
        price: 100,
        amount: 2,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 10,
    createdAt: new Date("2025-10-04T10:45:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "wfw50wz1z38z3jo0jqci3hfb",
        name: "キャラメル",
        price: 150,
        amount: 1,
      },
      {
        id: "d4yc9h64cixo921ybzntcgf7",
        name: "チルソン",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 11,
    createdAt: new Date("2025-10-04T10:50:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "oqlepx24xm8ktgt8nrx9tpje",
        name: "塩",
        price: 150,
        amount: 1,
      },
      {
        id: "rewzi8gl3niybtniael3uc9r",
        name: "カレー",
        price: 150,
        amount: 1,
      },
      {
        id: "p92trulfts7pz8pgiisehpmu",
        name: "アクエリ",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 12,
    createdAt: new Date("2025-10-04T10:55:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "ke03npycplggquox4ge694hk",
        name: "コーラ",
        price: 100,
        amount: 5,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 13,
    createdAt: new Date("2025-10-04T11:00:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "m5nidhr02wvgzvel38u5ws8p",
        name: "ファンタ",
        price: 100,
        amount: 2,
      },
      {
        id: "wfw50wz1z38z3jo0jqci3hfb",
        name: "キャラメル",
        price: 150,
        amount: 3,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 14,
    createdAt: new Date("2025-10-04T11:05:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "oqlepx24xm8ktgt8nrx9tpje",
        name: "塩",
        price: 150,
        amount: 1,
      },
    ],
  }),
  Order.assert({
    id: createId(),
    receiptNumber: 15,
    createdAt: new Date("2025-10-04T11:10:00.000Z").toISOString(),
    status: "UNCONFIRMED",
    statusChange: [],
    items: [
      {
        id: "rewzi8gl3niybtniael3uc9r",
        name: "カレー",
        price: 150,
        amount: 3,
      },
      {
        id: "d4yc9h64cixo921ybzntcgf7",
        name: "チルソン",
        price: 150,
        amount: 2,
      },
      {
        id: "p92trulfts7pz8pgiisehpmu",
        name: "アクエリ",
        price: 150,
        amount: 1,
      },
    ],
  }),
];
