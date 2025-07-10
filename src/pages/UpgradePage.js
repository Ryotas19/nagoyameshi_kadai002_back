// src/pages/UpgradePage.jsx

import React from 'react';
import axiosInstance from '../api/axiosInstance'; 
// axiosInstance にはあらかじめ
// baseURL: 'http://127.0.0.1:8000/api'
// が設定されているものとします

const UpgradePage = () => {
  const handleUpgrade = async () => {
    try {
      // Stripe ダッシュボードで発行した「価格ID」を貼り付け
      const priceId = 'price_1RbdzhPMt5lJfp1jAZABJZMa';

      // /api/create-checkout-session/ は
      // Django の CreateCheckoutSessionView にマッチして、
      // { url: session.url } を返す想定です
      const res = await axiosInstance.post(
        '/create-checkout-session/',
        { priceId }
      );

      // バックエンドから返ってくる checkout の URL を取得
      const { url } = res.data;

      // window.location.href で直接リダイレクト！
      window.location.href = url;
    } catch (err) {
      console.error("Checkout session 作成失敗", err);
      alert('決済画面への遷移に失敗しました。コンソールを確認してください。');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">プレミアムプランにアップグレード</h1>
      <p className="text-lg text-gray-700 mb-8">
        プレミアムプランに登録すると、お店の予約やお気に入り登録など、全ての機能が利用可能になります。
      </p>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-2">月額300円</h2>
        <p className="text-gray-500 mb-6">いつでもキャンセル可能です。</p>
        <button
          onClick={handleUpgrade}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          アップグレードする
        </button>
      </div>
    </div>
  );
};

export default UpgradePage;
