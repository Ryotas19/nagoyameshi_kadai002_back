import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await loginUser(email, password);
            navigate('/');
        } catch (err) {
            setError('メールアドレスまたはパスワードが正しくありません。');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <h1 className="text-4xl font-bold text-center mb-8">ログイン</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <label className="block font-bold mb-1" htmlFor="email">メールアドレス</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" required />
                </div>
                <div>
                    <div className="flex justify-between items-baseline">
                        <label className="block font-bold mb-1" htmlFor="password">パスワード</label>
                        <Link to="/password/reset" className="text-sm text-blue-500 hover:underline">パスワードをお忘れですか？</Link>
                    </div>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded" required />
                </div>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg">
                    ログイン
                </button>
            </form>
        </div>
    );
};
export default LoginPage;