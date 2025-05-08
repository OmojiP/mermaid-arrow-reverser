# Mermaid Arrow Reverser

Markdown内のMermaid記法にある `a --> b` を `b <-- a` に反転するVS Code拡張機能です。

## 使い方

1. MermaidコードブロックのあるMarkdownファイルを開く。
2. 矢印のある行にカーソルを移動。
3. `Ctrl + .`（Macは`Cmd + .`）を押すと、その行の矢印が反転します。

## 対応例

```mermaid
classDiagram
    class a
    class b
    a --> b
```
が以下のように変換されます：

```mermaid
classDiagram
    class a
    class b
    b <-- a
```

---

## ⚙️ インストール方法

1. このコードをローカルで開き、`npm install` で依存関係をインストール。
2. `F5` キーで「拡張機能の開発ホスト」を起動してテスト。

これで、`Ctrl + .` を使って矢印を反転させることができる拡張機能が完成です！

---

もし別のカスタマイズが必要であればお知らせください。