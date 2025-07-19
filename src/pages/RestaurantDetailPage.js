import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AuthContext from '../context/AuthContext';
import StarRating from '../components/StarRating';
import UpgradePrompt from '../components/UpgradePrompt';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPremium = user && user.plan === 'premium';

  // 店舗データ
  const [restaurant, setRestaurant] = useState(null);

  // 新規レビュー用state
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // 編集レビュー用state
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  // 予約フォームstate
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [reservationError, setReservationError] = useState('');

  // 店舗詳細取得
  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/restaurants/${id}/`);
      setRestaurant(res.data);
    } catch (err) {
      console.error('店舗詳細の取得に失敗しました', err);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  // お気に入り切替
  const handleFavorite = async () => {
    try {
      await axiosInstance.post(`/restaurants/${id}/favorite/`);
      fetchRestaurant();
    } catch (err) {
      console.error('お気に入り登録に失敗しました', err);
    }
  };

  // 予約送信
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('予約するにはログインが必要です。');
      navigate('/login');
      return;
    }
    setReservationError('');
    try {
      await axiosInstance.post('/reservations/', {
        restaurant: Number(id),
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        number_of_people: numberOfPeople,
      });
      alert('予約が完了しました。');
      setReservationDate('');
      setReservationTime('');
      setNumberOfPeople(1);
    } catch (err) {
      console.error('予約に失敗しました', err.response?.data);
      setReservationError('この日時の予約はできません。');
    }
  };

  // 新規レビュー投稿
  const handleNewReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      setReviewError('評価（星）を選択してください。');
      return;
    }
    setReviewError('');
    try {
      await axiosInstance.post('/reviews/', {
        restaurant: Number(id),
        rating: newRating,
        comment: newComment,
      });
      fetchRestaurant();
      setNewRating(0);
      setNewComment('');
      setShowNewReviewForm(false);
    } catch (err) {
      console.error('レビューの投稿に失敗しました', err.response?.data);
      setReviewError(
        err.response?.data.non_field_errors?.[0] ||
        err.response?.data.detail ||
        'レビューの投稿に失敗しました。'
      );
    }
  };

  // 編集レビュー送信
  const handleEditReviewSubmit = async (e) => {
    e.preventDefault();
    if (editRating === 0) {
      setReviewError('評価（星）を選択してください。');
      return;
    }
    setReviewError('');
    try {
      await axiosInstance.patch(
        `/reviews/${editingReview.id}/`,
        { rating: editRating, comment: editComment }
      );
      fetchRestaurant();
      setEditingReview(null);
    } catch (err) {
      console.error('レビューの編集に失敗しました', err.response?.data);
      setReviewError(
        err.response?.data.non_field_errors?.[0] ||
        err.response?.data.detail ||
        'レビューの編集に失敗しました。'
      );
    }
  };

  // レビュー削除
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('このレビューを削除しますか？')) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}/`);
      fetchRestaurant();
      if (editingReview?.id === reviewId) {
        setEditingReview(null);
      }
    } catch (err) {
      console.error('レビューの削除に失敗しました', err);
      alert('レビューの削除に失敗しました。');
    }
  };

  if (!restaurant) {
    return <div className="text-center py-10">読み込み中…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 店舗情報 */}
      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          <img
            src={restaurant.image || 'https://placehold.co/1200x800/F0AD4E/FFFFFF?text=NAGOYAMESHI'}
            alt={restaurant.name}
            className="w-full h-auto rounded-lg shadow mb-4"
          />
          <div className="flex items-center mb-2">
            <h1 className="text-4xl font-bold">{restaurant.name}</h1>
            {user && (
              <button
                onClick={handleFavorite}
                className={`ml-4 p-2 rounded-full transition-colors duration-200 ${
                  restaurant.is_favorited ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
            )}
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-3 py-1 rounded-full">
            {restaurant.category_name}
          </span>
          <div className="mt-4 mb-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">説明</h2>
            <p className="text-gray-700 mb-4">{restaurant.description}</p>
            <h2 className="text-xl font-semibold text-green-600 mb-2">住所</h2>
            <p className="text-gray-600">{restaurant.address}</p>
          </div>
        </div>
        {/* 予約フォーム */}
        <div className="md:w-1/3">
          {isPremium ? (
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-2xl font-bold mb-4 text-center">このお店を予約する</h2>
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">日付</label>
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">時間</label>
                  <input
                    type="time"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">人数</label>
                  <select
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    className="w-full p-2 border rounded bg-white"
                    required
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}名
                      </option>
                    ))}
                  </select>
                </div>
                {reservationError && <p className="text-red-500 text-center">{reservationError}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
                >
                  予約を確定する
                </button>
              </form>
            </div>
          ) : user ? (
            <UpgradePrompt featureName="店舗の予約" />
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>
                予約するには、
                <Link to="/login" className="text-yellow-500 font-bold">
                  ログイン
                </Link>
                が必要です。
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="my-12" />

      {/* レビューセクション */}
      <div>
        <h2 className="text-3xl font-bold mb-6">レビュー</h2>

        {/* 新規レビュー */}
        {isPremium && !editingReview && (
          <div className="mb-6">
            {!showNewReviewForm ? (
              <button
                onClick={() => setShowNewReviewForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                レビューを投稿する
              </button>
            ) : (
              <form onSubmit={handleNewReviewSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
                <label className="block font-bold mb-2">評価</label>
                <StarRating rating={newRating} setRating={setNewRating} />
                <label className="block font-bold mb-1">コメント</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded h-32"
                  required
                />
                {reviewError && <p className="text-red-500">{reviewError}</p>}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
                  >
                    投稿する
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewReviewForm(false);
                      setNewRating(0);
                      setNewComment('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 投稿済みレビュー一覧 */}
        <div className="space-y-6">
          {restaurant.reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow">
              {editingReview?.id === review.id ? (
                <form onSubmit={handleEditReviewSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold mb-2">レビューを編集</h3>
                  <StarRating rating={editRating} setRating={setEditRating} />
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 border rounded h-32"
                    required
                  />
                  {reviewError && <p className="text-red-500">{reviewError}</p>}
                  <div className="flex gap-4">
                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                      更新する
                    </button>
                    <button type="button" onClick={() => handleDeleteReview(review.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                      削除
                    </button>
                    <button type="button" onClick={() => setEditingReview(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                      キャンセル
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{review.user_username}</p>
                    {user && review.user_username === user.username && (
                      <button
                        onClick={() => {
                          setEditingReview(review);
                          setEditRating(review.rating);
                          setEditComment(review.comment);
                        }}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        編集
                      </button>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleString()}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
