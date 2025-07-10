// src/pages/UpgradeSuccessPage.jsx

import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import AuthContext from '../context/AuthContext'  // 実際のパスに合わせてください

const UpgradeSuccessPage = () => {
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  useEffect(() => {
    const confirmUpgrade = async () => {
      try {
        // URL のクエリから session_id を取得
        const params    = new URLSearchParams(window.location.search)
        const sessionId = params.get('session_id')
        if (!sessionId) throw new Error('session_id がありません')

        // ———① バックエンドに session_id を送り、DB を更新———
        await axiosInstance.post('/confirm-subscription/', { session_id: sessionId })

        // ———② 最新ユーザー情報を取得 ————————————————
        const res       = await axiosInstance.get('/auth/user/')
        const freshUser = res.data

        // ———③ Context にも反映 ——————————————————————
        setUser(freshUser)

        // ———④ プラン更新の確認 ————————————————————
        if (freshUser.plan === 'premium') {
          setLoading(false)
          setTimeout(() => navigate('/mypage'), 5000)
        } else {
          throw new Error('プラン更新が確認できませんでした。')
        }
      } catch (err) {
        console.error(err)
        setError('プラン更新に失敗しました。少し待ってから再度お試しください。')
        setLoading(false)
      }
    }

    confirmUpgrade()
  }, [navigate, setUser])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">アップグレード完了を確認中…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/upgrade')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          再度アップグレード画面へ
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-green-600">アップグレード完了！</h1>
      <p className="text-lg text-gray-700 mb-8">
        プレミアムプランへの切り替えが完了しました。<br/>
        5秒後にマイページへ移動します…
      </p>
      <button
        onClick={() => navigate('/mypage')}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        今すぐマイページへ
      </button>
    </div>
  )
}

export default UpgradeSuccessPage
