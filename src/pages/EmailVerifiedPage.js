import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerifiedPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">メール認証が完了しました</h1>
                <p className="text-lg text-gray-700 mb-6">
                    アカウントの準備が整いました。ログインしてNAGOYAMESHIをお楽しみください。
                </p>
                <Link 
                    to="/login" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    ログインページへ
                </Link>
            </div>
        </div>
    );
};
export default EmailVerifiedPage;
