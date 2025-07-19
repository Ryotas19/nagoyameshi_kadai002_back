import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError({ password2: ['パスワードが一致しません。'] });
            return;
        }
        setError(null);
        try {
            await axiosInstance.post('/auth/registration/', {
                username,
                email,
                // ──────────────── ここを変更 ────────────────
                password1: password,
                password2: password2,
            });
            navigate('/verification-sent');
        } catch (err) {
            setError(err.response?.data || { detail: '不明なエラーが発生しました。' });
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <h1 className="text-4xl font-bold text-center mb-8">会員登録</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                {error && (
                    <div className="text-red-500 text-center p-2 bg-red-100 rounded">
                        {Object.entries(error).map(([key, value]) => (
                            <p key={key}>{Array.isArray(value) ? value.join(' ') : value}</p>
                        ))}
                    </div>
                )}
                <div>
                    <label className="block font-bold mb-1" htmlFor="username">ユーザー名</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-bold mb-1" htmlFor="email">メールアドレス</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-bold mb-1" htmlFor="password">パスワード</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-bold mb-1" htmlFor="password2">パスワード（確認用）</label>
                    <input
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg"
                >
                    登録する
                </button>
            </form>
        </div>
    );
};

export default SignupPage;