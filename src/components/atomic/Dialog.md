## Dialog コンポーネント

ActiveArea内に収まるダイアログコンポーネントです。

### 使用方法

```tsx
import { useRef } from "react";
import { Dialog, DialogRef } from "@/components/atomic/Dialog";

function MyComponent() {
  const dialogRef = useRef<DialogRef>(null);

  const handleOpen = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    console.log("Dialog closed");
  };

  return (
    <>
      <button onClick={handleOpen}>Open Dialog</button>

      <Dialog ref={dialogRef} onClose={handleClose}>
        <div style={{ padding: "2rem" }}>
          <h2>Dialog Title</h2>
          <p>Dialog content goes here...</p>
          <button onClick={() => dialogRef.current?.close()}>
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
}
```

### 特徴

- ActiveArea内にちょうど収まる（margin: 4rem）
- オーバーレイはActiveArea内のみに表示
- オーバーレイをクリックすると閉じる
- `position: absolute`を使用して親要素（ActiveArea）内に配置
- `showModal()`と`close()`メソッドで開閉を制御

### Props

- `children`: ダイアログの内容
- `onClose`: ダイアログが閉じられたときのコールバック

### Ref Methods

- `showModal()`: ダイアログを開く
- `close()`: ダイアログを閉じる
