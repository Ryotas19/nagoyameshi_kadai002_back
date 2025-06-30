import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PaymentSuccessPage = () => {
    const { user } = useContext(AuthContext);

    // このページが表示されたら、ユーザー情報を更新するなどの処理をここに追加できます。
    // 例えば、AuthContextにユーザー情報を再取得する関数を追加するなど。
    useEffect(() => {
        // ユーザー情報を更新するロジックをここに実装
        console.log("Payment successful for user:", user);
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">ありがとうございます！</h1>
                <p className="text-lg text-gray-700 mb-6">
                    プレミアムプランへのアップグレードが完了しました。
                </p>
                <Link 
                    to="/" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    トップページへ戻る
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
