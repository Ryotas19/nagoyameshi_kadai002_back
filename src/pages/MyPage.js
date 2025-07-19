// src/pages/MyPage.jsx

import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'      // Pathは実際に合わせて
import axiosInstance from '../api/axiosInstance'      // Pathは実際に合わせて

const MyPage = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  // 最新のユーザー情報を取ってくる関数
 const reloadUser = useCallback(async () => {
   try {
     const { data } = await axiosInstance.get('/auth/user/')
     setUser(data)
     localStorage.setItem('user', JSON.stringify(data))
   } catch (e) {
     console.error('ユーザー情報の取得に失敗', e)
   }
 }, [setUser])

  // ユーザー情報を最新化する effect を追加
  useEffect(() => {
    reloadUser()
    const onFocus = () => reloadUser()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [setUser])

  // フォーム用state
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [message, setMessage]   = useState('')

  // user が変わったらフォームにセット
  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  // プロフィール更新
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await axiosInstance.put('/auth/user/', { username, email })
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
      setMessage('プロフィールを更新しました。')
    } catch (err) {
      console.error(err)
      setMessage('プロフィール更新に失敗しました。')
    }
  }

  // Stripeポータル（課金管理ページ）へ
  const handleManageBilling = async () => {
    try {
      const res = await axiosInstance.post('/create-portal-session/')
      window.location.href = res.data.url
    } catch (err) {
      console.error(err)
      alert('お支払い情報の管理ページへの遷移に失敗しました。')
    }
  }

  if (!user) {
    return <div className="text-center py-10">読み込み中…</div>
  }

  const isPremium = user.plan === 'premium'

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8">マイページ</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
        {/* プロフィール編集 */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <h2 className="text-2xl font-semibold">プロフィール編集</h2>
          {message && (
            <p className="text-green-700 bg-green-100 p-3 rounded-md">{message}</p>
          )}
          <div>
            <label htmlFor="username" className="block font-bold mb-1">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-bold mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            更新
          </button>
        </form>

        <hr />

        {/* プラン情報 */}
        <div>
          <h2 className="text-2xl font-semibold">ご契約プラン</h2>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <span className="text-lg capitalize font-bold text-yellow-600">
              {user.plan}プラン
            </span>
            {isPremium ? (
              <button
                onClick={handleManageBilling}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                お支払い情報の管理・解約
              </button>
            ) : (
              <button
                onClick={() => navigate('/upgrade')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                プレミアム会員にアップグレード
              </button>
            )}
          </div>
          {isPremium && (
            <p className="text-sm text-gray-500 mt-2">
              ※クレジットカード情報の変更や解約は上記ボタンから行えます。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyPage
