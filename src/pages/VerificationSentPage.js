import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSentPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                 <h1 className="text-3xl font-bold text-gray-800 mb-4">認証メールを送信しました</h1>
                <p className="text-lg text-gray-700 mb-6">
                    ご登録いただいたメールアドレスに、アカウントを有効化するためのリンクを送信しました。メールをご確認の上、認証を完了してください。
                </p>
                <p className="text-sm text-gray-500">（開発環境では、Djangoサーバーのターミナルにメールの内容が出力されます）</p>
                <Link 
                    to="/" 
                    className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    トップページへ戻る
                </Link>
            </div>
        </div>
    );
};
export default VerificationSentPage;