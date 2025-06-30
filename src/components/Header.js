import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">NAGOYAMESHI</Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/reservations" className="text-gray-600 hover:text-yellow-500">予約一覧</Link>
                            <Link to="/favorites" className="text-gray-600 hover:text-yellow-500">お気に入り</Link>
                            {/* ここで user.username を表示します */}
                            <span className="text-gray-800">ようこそ {user.username} さん</span>
                            <button onClick={logoutUser} className="text-gray-600 hover:text-yellow-500">ログアウト</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-yellow-500">ログイン</Link>
                            <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">会員登録</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
