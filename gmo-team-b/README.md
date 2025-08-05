🚀 開発環境のセットアップと起動

このプロジェクトをローカル環境で起動する手順は以下の通りです。

前提条件

Node.js (v18.x 以上を推奨)

npm (Node.js に同梱)

手順
① リポジトリをクローン

git clone https://github.com/your-username/your-repository.git
cd GMO_Team_B.git

② 必要なパッケージをインストールします。

_npm のインストール_
npm install

_material UI のインストール_
npm install @mui/material
npm install @emotion/react
npm install @emotion/styled
npm install @mui/icons-material

開発サーバーを起動します。

ブラウザで確認します。
npm run dev をし、ブラウザで http://localhost:3000 にアクセスすると、アプリケーションが表示されます。

**✨ Kombai の使用方法**

このプロジェクトでは、デザイン（Figma など）からコードを生成するために Kombai を使用することがあります。

_インストール方法_

①VScode の拡張機能から komai を検索しインストール

②figma と kombai の連携

③ 実際にプロンプトにて該当するコンポーネント(fimga の URL)を入力し、UI 生成

_クレジットについて_

Kombai はクレジットベースのサービスです。

初期クレジット: 新規アカウントには 1000 クレジット が付与されます。

クレジット消費量: 1 回のデザイン → コード変換で、約 30〜40 クレジット を消費します。

クレジットの残量に注意しながら計画的に利用してください。
