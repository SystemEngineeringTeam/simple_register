import type { ReactElement } from "react";
import { useStore } from "@nanostores/react";
import { HStack, styled as p, VStack } from "panda/jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/atomic/Button";
import { NumberInput } from "@/components/atomic/NumberInput";
import { Table } from "@/components/atomic/Table";
import { wrapValidation } from "@/lib/arktype";
import { focusOrderLastRowProduct } from "@/lib/focus-manager";
import {
  $currentOrder,
  findDiscountByNumber,
  findItemByNumber,
  getFilledOrderRows,
  resetCurrentOrder,
  setDepositAmount,
  setDiscountCode,
} from "@/lib/stores/current-order";
import { $orders } from "@/lib/stores/orders";
import { $orderPhase } from "@/lib/stores/phase";
import { DiscountNumber, ItemNumber } from "@/types/item";

const TableBodyRow = p("tr", {
  base: {
    "& > :first-child": {
      textAlign: "right",
      verticalAlign: "middle",
    },
    "& > td": {
      fontFamily: "sans",
      fontWeight: "bold",
    },
    "& > td > :last-child": {
      pr: "2",
    },
  },
});

export function AmountSection(): ReactElement {
  const order = useStore($currentOrder);
  const orderPhase = useStore($orderPhase);

  type RightStep = "DISCOUNT" | "DEPOSIT" | "CONFIRM";
  const [rightStep, setRightStep] = useState<RightStep>("DISCOUNT");

  // 合計金額と割引額の計算
  const { totalDiscount, total } = useMemo(() => {
    const filledRows = getFilledOrderRows(order);
    let subtotalAmount = 0;
    let totalDiscountAmount = 0;

    const discountNumber = wrapValidation(
      DiscountNumber(Number.parseInt(order.discountCode, 10)),
    ).unwrapOr(null);
    const discountInfo = discountNumber != null
      ? findDiscountByNumber(discountNumber)
      : null;

    for (const row of filledRows) {
      const itemNumber = wrapValidation(
        ItemNumber(Number.parseInt(row.productCode, 10)),
      ).unwrapOr(null);
      if (itemNumber == null)
        continue;

      const item = findItemByNumber(itemNumber);
      if (!item)
        continue;

      const quantity = Number.parseInt(row.quantity || "1", 10);
      subtotalAmount += item.price * quantity;

      if (discountInfo) {
        const discountAmount = discountInfo.amount[item.id] ?? 0;
        totalDiscountAmount += discountAmount * quantity;
      }
    }

    return {
      subtotal: subtotalAmount,
      totalDiscount: totalDiscountAmount,
      total: subtotalAmount - totalDiscountAmount,
    };
  }, [order]);

  const change = useMemo(() => {
    const depositNumber = Number.parseInt(order.depositAmount || "0", 10);
    return Math.max(0, depositNumber - total);
  }, [order.depositAmount, total]);

  const discountInputRef = useRef<HTMLInputElement>(null);
  const depositInputRef = useRef<HTMLInputElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const dotPressedRef = useRef(false);

  useEffect(() => {
    dotPressedRef.current = false;
    let nextStep: RightStep = "DISCOUNT";
    if (orderPhase === "PROCESS_PAYMENT") {
      nextStep = rightStep === "CONFIRM" ? "CONFIRM" : "DEPOSIT";
    } else if (orderPhase === "CHECK_DISCOUNT") {
      nextStep = "DISCOUNT";
    }
    if (nextStep !== rightStep) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setRightStep(nextStep);
    }
  }, [orderPhase, rightStep]);

  useEffect(() => {
    if (orderPhase === "CHECK_DISCOUNT" && rightStep === "DISCOUNT") {
      const input = discountInputRef.current;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [orderPhase, rightStep]);

  useEffect(() => {
    if (orderPhase === "PROCESS_PAYMENT" && rightStep === "DEPOSIT") {
      const input = depositInputRef.current;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, [orderPhase, rightStep]);

  useEffect(() => {
    if (rightStep === "CONFIRM") {
      confirmButtonRef.current?.focus();
    }
  }, [rightStep]);

  const handleConfirm = (): void => {
    const now = new Date().toISOString();
    const filledRows = getFilledOrderRows(order);

    // 注文アイテムを構築
    type OrderItem = { id: string; name: string; price: number; amount: number };
    const orderItems: OrderItem[] = [];
    for (const row of filledRows) {
      const itemNumber = wrapValidation(
        ItemNumber(Number.parseInt(row.productCode, 10)),
      ).unwrapOr(null);
      if (itemNumber == null)
        continue;

      const item = findItemByNumber(itemNumber);
      if (!item)
        continue;

      const quantity = Number.parseInt(row.quantity || "1", 10);
      orderItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        amount: quantity,
      });
    }

    // 既存の注文を更新（UNCONFIRMED → WAITING_COOKING）
    const currentOrders = $orders.get();
    const orderId = order.orderId;

    if (orderId != null) {
      const existingOrderIndex = currentOrders.findIndex(
        (o) => o.id === orderId,
      );

      if (existingOrderIndex !== -1) {
        const updatedOrders = [...currentOrders];
        const existingOrder = updatedOrders[existingOrderIndex]!;

        // 既存の注文が UNCONFIRMED でない場合は更新しない
        if (existingOrder.status !== "UNCONFIRMED") {
          console.warn("[ORDER_CONFIRMATION] Order is not UNCONFIRMED", { orderId, status: existingOrder.status });
          return;
        }

        updatedOrders[existingOrderIndex] = {
          ...existingOrder,
          status: "WAITING_COOKING",
          items: orderItems as typeof existingOrder.items,
          statusChange: [
            ...existingOrder.statusChange,
            {
              to: "WAITING_COOKING",
              at: now,
            },
          ],
        };
        $orders.set(updatedOrders);
      }
    } // eslint-disable-next-line no-console
    console.log("[ORDER_CONFIRMATION]", {
      receiptNumber: order.receiptNumber,
      discountCode: order.discountCode,
      depositAmount: order.depositAmount,
      items: orderItems,
      confirmedAt: now,
      total,
      totalDiscount,
      change,
    });

    resetCurrentOrder();
    $orderPhase.set("CHECK_RECEIPT_NUMBER");
    setRightStep("DISCOUNT");
    dotPressedRef.current = false;
  };

  return (
    <VStack alignItems="flex-start" gap="4" w="100%">
      <p.table w="100%">
        <Table.head>
          <p.tr>
            <p.th p="0!" w="24"></p.th>
            <p.th p="0!" w="stretch"></p.th>
          </p.tr>
        </Table.head>
        <Table.body>
          <TableBodyRow bg="green.600" color="white">
            <Table.cell align="right" verticalAlign="middle!">
              合計
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <p.code fontSize="2xl">{total}</p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow bg="red.200">
            <Table.cell align="right" verticalAlign="middle!">
              うち&ensp;割引
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <HStack>
                  <p.p fontWeight="normal">割引番号</p.p>
                  <HStack gap="2">
                    <p.code color="gray.500">D</p.code>
                    <NumberInput
                      disabled={orderPhase !== "CHECK_DISCOUNT"}
                      h="10"
                      inputMode="numeric"
                      onChange={(event) => {
                        setDiscountCode(event.target.value);
                        dotPressedRef.current = false;
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Backspace") {
                          event.preventDefault();
                          const currentValue = event.currentTarget.value;
                          dotPressedRef.current = false;
                          if (currentValue === "") {
                            focusOrderLastRowProduct();
                            setDiscountCode("");
                            setRightStep("DISCOUNT");
                            $orderPhase.set("SELECT_ITEMS");
                          } else {
                            setDiscountCode("");
                            requestAnimationFrame(() => {
                              const input = discountInputRef.current;
                              input?.focus();
                              input?.select();
                            });
                          }
                        } else if (event.key === "Enter") {
                          event.preventDefault();
                          $orderPhase.set("PROCESS_PAYMENT");
                          setRightStep("DEPOSIT");
                          dotPressedRef.current = false;
                        }
                      }}
                      outline={{
                        base: "2px solid",
                        _focus: "4px solid",
                      }}
                      outlineColor="black"
                      ref={discountInputRef}
                      textAlign="center"
                      value={order.discountCode}
                      w="10"
                    />
                  </HStack>

                </HStack>
                <p.code
                  color="red.600"
                  fontSize="2xl"
                  w="32"
                >
                  {totalDiscount > 0 ? `-${totalDiscount}` : "0"}
                </p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow>
            <Table.cell align="right" verticalAlign="middle!">
              預かり
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <NumberInput
                  disabled={orderPhase !== "PROCESS_PAYMENT"}
                  fontSize="2xl"
                  inputMode="numeric"
                  onChange={(event) => {
                    setDepositAmount(event.target.value);
                    if (rightStep === "CONFIRM") {
                      setRightStep("DEPOSIT");
                    }
                    dotPressedRef.current = false;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace") {
                      event.preventDefault();
                      const currentValue = event.currentTarget.value;
                      dotPressedRef.current = false;
                      if (currentValue === "") {
                        setDepositAmount("");
                        setRightStep("DISCOUNT");
                        $orderPhase.set("CHECK_DISCOUNT");
                        requestAnimationFrame(() => {
                          const input = discountInputRef.current;
                          input?.focus();
                          input?.select();
                        });
                      } else {
                        setDepositAmount("");
                        requestAnimationFrame(() => {
                          const input = depositInputRef.current;
                          input?.focus();
                          input?.select();
                        });
                      }
                    } else if (event.key === "Enter") {
                      event.preventDefault();
                      setRightStep("CONFIRM");
                      dotPressedRef.current = false;
                    }
                  }}
                  ref={depositInputRef}
                  textAlign="right"
                  value={order.depositAmount}
                  w="32"
                />
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
          <TableBodyRow>
            <Table.cell align="right" verticalAlign="middle!">
              お釣り
            </Table.cell>
            <Table.cell textAlign="right">
              <HStack gap="2" justifyContent="flex-end">
                <p.code fontSize="2xl">{change}</p.code>
                <p.p>円</p.p>
              </HStack>
            </Table.cell>
          </TableBodyRow>
        </Table.body>
      </p.table>
      <Button
        animateOnHover
        disabled={rightStep !== "CONFIRM"}
        onBlur={() => {
          dotPressedRef.current = false;
        }}
        onClick={(event) => {
          if (rightStep === "CONFIRM" && event.detail !== 0) {
            handleConfirm();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Backspace") {
            event.preventDefault();
            dotPressedRef.current = false;
            setRightStep("DEPOSIT");
            requestAnimationFrame(() => {
              const input = depositInputRef.current;
              input?.focus();
              input?.select();
            });
          } else if (event.key === ".") {
            event.preventDefault();
            dotPressedRef.current = true;
          } else if (event.key === "Enter") {
            event.preventDefault();
            if (dotPressedRef.current && rightStep === "CONFIRM") {
              handleConfirm();
            }
            dotPressedRef.current = false;
          } else {
            dotPressedRef.current = false;
          }
        }}
        ref={confirmButtonRef}
        variant="filled"
        w="full"
      >
        注文確定 (. + Enter)
      </Button>
    </VStack>
  );
}
