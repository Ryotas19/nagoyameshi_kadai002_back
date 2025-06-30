import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../api/axiosInstance'; // 作成したインスタンスを利用

const UpgradePage = () => {

    const handleUpgrade = async () => {
        try {
            // ここに、Stripeで作成したプレミアムプランの「価格ID」を貼り付けます
            // 例: 'price_1PcSqCRW...'
            const priceId = 'price_1Rd1kvPMt5lJfp1jbzozI9MZ'; 

            // ここに、あなたのStripeの「公開可能キー」を貼り付けます
            // 例: 'pk_test_51RWU...'
            const stripePromise = loadStripe('pk_test_51RWUi6PMt5lJfp1jbnFXzKObEe34UA8spvH1WPZclLDuwr8dWzEdHfQqjenH2pcwsHUsBgh99Hw7Z2xFfPOkBgvp00NkZrBLlO');

            const response = await axiosInstance.post('/create-checkout-session/', { priceId });
            const { id: sessionId } = response.data;

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (error) {
                console.error("Stripe Checkout error", error);
            }
        } catch (error) {
            console.error("Failed to create checkout session", error);
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