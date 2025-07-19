import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelledPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                 <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">決済はキャンセルされました</h1>
                <p className="text-lg text-gray-700 mb-6">
                    アップグレード手続きは完了していません。いつでも再度お試しいただけます。
                </p>
                <Link 
                    to="/upgrade" 
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    アップグレードページへ戻る
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancelledPage;