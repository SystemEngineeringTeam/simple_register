type FocusFunction = () => void;

let receiptInput: HTMLInputElement | null = null;

type OrderFocusHelpers = {
  focusFirstRowProductInput?: FocusFunction;
  focusLastRowProductInput?: FocusFunction;
};

let orderFocusHelpers: OrderFocusHelpers = {};

export function registerReceiptInput(input: HTMLInputElement | null): void {
  receiptInput = input;
}

export function focusReceiptInput(): void {
  if (!receiptInput)
    return;
  receiptInput.focus();
  receiptInput.select?.();
}

export function registerOrderFocusHelpers(helpers: OrderFocusHelpers): void {
  orderFocusHelpers = helpers;
}

export function focusOrderFirstRowProduct(): void {
  orderFocusHelpers.focusFirstRowProductInput?.();
}

export function focusOrderLastRowProduct(): void {
  orderFocusHelpers.focusLastRowProductInput?.();
}
