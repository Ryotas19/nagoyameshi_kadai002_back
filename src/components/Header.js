// src/components/Header.jsx

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* ロゴ */}
        <Link to="/" className="text-2xl font-bold text-gray-800">NAGOYAMESHI</Link>

        {/* Desktop ナビ */}
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/mypage"    className="text-gray-600 hover:text-yellow-500">マイページ</Link>
              <Link to="/reservations" className="text-gray-600 hover:text-yellow-500">予約一覧</Link>
              <Link to="/favorites"   className="text-gray-600 hover:text-yellow-500">お気に入り</Link>
              <span className="text-gray-800">ようこそ {user.username} さん</span>
              <button onClick={logoutUser} className="text-gray-600 hover:text-yellow-500">ログアウト</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="text-gray-600 hover:text-yellow-500">ログイン</Link>
              <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                会員登録
              </Link>
            </>
          )}
        </nav>

        {/* Mobile メニューアイコン */}
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          {isOpen
            ? <HiX className="w-6 h-6 text-gray-800" />
            : <HiMenu className="w-6 h-6 text-gray-800" />
          }
        </button>
      </div>

      {/* Mobile ドロワー */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-2">
            {user ? (
              <>
                <Link to="/mypage"      onClick={toggleMenu} className="text-gray-600 hover:text-yellow-500">マイページ</Link>
                <Link to="/reservations" onClick={toggleMenu} className="text-gray-600 hover:text-yellow-500">予約一覧</Link>
                <Link to="/favorites"    onClick={toggleMenu} className="text-gray-600 hover:text-yellow-500">お気に入り</Link>
                <span className="text-gray-800">ようこそ {user.username} さん</span>
                <button
                  onClick={() => { logoutUser(); toggleMenu(); }}
                  className="text-gray-600 hover:text-yellow-500 text-left"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  onClick={toggleMenu} className="text-gray-600 hover:text-yellow-500">ログイン</Link>
                <Link to="/signup" onClick={toggleMenu} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-center">
                  会員登録
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
