# Mermaid Arrow Reverser

chatGPTに作ってもらった
Markdown内のMermaid記法 `a --> b` を `b <-- a` に反転するVS Code拡張機能です。

## 使い方

1. MermaidコードブロックのあるMarkdownファイルを開く
2. 矢印のある行にカーソルを移動
3. `Ctrl + .`（Macは`Cmd + .`）を押すと、その行の矢印が反転

## 適用例

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

## インストール方法

`extension.js`をvscodeで開いてF5を押すとテストできます

vscodeの拡張機能タブ→…→VSIXからのインストールから、vsixファイルを選択するとインストールできます
