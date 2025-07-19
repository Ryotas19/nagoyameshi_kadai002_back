import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const PasswordResetConfirmPage = () => {
    const { uid, token } = useParams();
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword1 !== newPassword2) {
            setError('パスワードが一致しません。');
            return;
        }
        setError('');
        try {
            await axiosInstance.post('/auth/password/reset/confirm/', {
                uid, token, new_password1: newPassword1, new_password2: newPassword2
            });
            setMessage('パスワードが正常に再設定されました。');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('リンクが無効か期限切れです。再度お試しください。');
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
            <h1 className="text-3xl font-bold text-center mb-8">新しいパスワードを設定</h1>
            {message ? <p className="text-green-500 text-center">{message}</p> :
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <div>
                        <label className="block font-bold mb-1" htmlFor="new_password1">新しいパスワード</label>
                        <input type="password" id="new_password1" value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} className="w-full p-3 border rounded" required />
                    </div>
                    <div>
                        <label className="block font-bold mb-1" htmlFor="new_password2">新しいパスワード（確認用）</label>
                        <input type="password" id="new_password2" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} className="w-full p-3 border rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg">
                        パスワードをリセット
                    </button>
                </form>
            }
        </div>
    );
};
export default PasswordResetConfirmPage;