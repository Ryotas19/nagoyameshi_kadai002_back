import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const PasswordResetRequestPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axiosInstance.post('/auth/password/reset/', { email });
            setMessage('パスワード再設定用のメールを送信しました。Djangoサーバーのターミナルをご確認ください。');
        } catch (err) {
            setError('エラーが発生しました。メールアドレスをご確認ください。');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <h1 className="text-3xl font-bold text-center mb-8">パスワードをリセット</h1>
            {message ? <p className="text-green-600 bg-green-100 p-4 rounded-md text-center mb-4">{message}</p> :
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <p className="text-gray-600">ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。</p>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block font-bold mb-1" htmlFor="email">メールアドレス</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg">
                        送信
                    </button>
                    <div className="text-center">
                        <Link to="/login" className="text-sm text-blue-500 hover:underline">ログインページに戻る</Link>
                    </div>
                </form>
            }
        </div>
    );
};
export default PasswordResetRequestPage;
