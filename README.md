# Mermaid Class Tools

chatGPTに作ってもらった
Markdown内のMermaid記述を支援するVS Code拡張機能です。

![](https://raw.githubusercontent.com/OmojiP/mermaid-class-tools/main/img/use.gif)

## 使い方

### リネーム

- リネームしたい単語ブロックの上でF2を押し、名前を変更します

### 矢印の反転

1. MermaidコードブロックのあるMarkdownファイルを開く
2. 矢印のある行にカーソルを移動
3. `Ctrl + .`（Macは`Cmd + .`）を押すと、その行の矢印が反転

### 矢印の役割確認

- 矢印にカーソルを重ねると矢印の役割説明が表示されます

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


## GitHub

https://github.com/OmojiP/mermaid-class-tools