import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AuthContext from '../context/AuthContext';
import StarRating from '../components/StarRating';

const RestaurantDetailPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- ここから修正 ---
    const [showReviewForm, setShowReviewForm] = useState(false); // フォームの表示状態を管理
    // --- ここまで修正 ---

    // Review states
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewError, setReviewError] = useState("");

    // Reservation states
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [reservationError, setReservationError] = useState("");

    const fetchRestaurant = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/restaurants/${id}/`);
            setRestaurant(response.data);
        } catch (error) {
            console.error('店舗詳細の取得に失敗しました', error);
        }
    }, [id]);

    useEffect(() => {
        fetchRestaurant();
    }, [id, fetchRestaurant]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError("");
        if (rating === 0) {
            setReviewError("評価（星）を選択してください。");
            return;
        }
        try {
            await axiosInstance.post('/reviews/', {
                restaurant: id,
                rating: rating,
                comment: comment,
            });
            fetchRestaurant();
            setRating(0);
            setComment("");
            setShowReviewForm(false); // 投稿後にフォームを閉じる
        } catch (error) {
            console.error('レビューの投稿に失敗しました', error.response.data);
            setReviewError(error.response.data.non_field_errors?.[0] || "レビューの投稿に失敗しました。");
        }
    };

    const handleFavorite = async () => {
        try {
            await axiosInstance.post(`/restaurants/${id}/favorite/`);
            fetchRestaurant();
        } catch (error) {
            console.error('お気に入り登録に失敗しました', error);
        }
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("予約するにはログインが必要です。");
            navigate("/login");
            return;
        }
        setReservationError("");
        try {
            await axiosInstance.post('/reservations/', {
                restaurant: id,
                reservation_date: reservationDate,
                reservation_time: reservationTime,
                number_of_people: numberOfPeople,
            });
            alert("予約が完了しました。");
            setReservationDate("");
            setReservationTime("");
            setNumberOfPeople(1);
        } catch(error) {
            console.error("予約に失敗しました", error.response.data);
            setReservationError("この日時の予約はできません。");
        }
    };

    if (!restaurant) return <div className="text-center py-10">読み込み中...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 左カラム：店舗情報 */}
                <div className="md:col-span-2">
                    <img 
                        src={restaurant.image || 'https://placehold.co/1200x800/F0AD4E/FFFFFF?text=NAGOYAMESHI'} 
                        alt={restaurant.name}
                        className="w-full h-auto object-cover rounded-lg shadow-lg mb-6"
                    />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                            <p className="text-md text-gray-500 mt-1">{restaurant.category_name}</p>
                        </div>
                        {user && (
                            <button onClick={handleFavorite} className={`p-3 rounded-full transition-colors duration-200 ${restaurant.is_favorited ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-400'}`}>
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                            </button>
                        )}
                    </div>
                    <p className="text-lg text-gray-700 mb-6">{restaurant.description}</p>
                    <p className="text-md text-gray-600">{restaurant.address}</p>
                </div>

                {/* 右カラム：予約 */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                        <h2 className="text-2xl font-bold mb-4 text-center">このお店を予約する</h2>
                        <form onSubmit={handleReservationSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold mb-1" htmlFor="reservation_date">日付</label>
                                <input type="date" id="reservation_date" value={reservationDate} onChange={e => setReservationDate(e.target.value)} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block font-bold mb-1" htmlFor="reservation_time">時間</label>
                                <input type="time" id="reservation_time" value={reservationTime} onChange={e => setReservationTime(e.target.value)} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block font-bold mb-1" htmlFor="number_of_people">人数</label>
                                <select id="number_of_people" value={numberOfPeople} onChange={e => setNumberOfPeople(e.target.value)} className="w-full p-2 border rounded bg-white" required>
                                    {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}名</option>)}
                                </select>
                            </div>
                            {reservationError && <p className="text-red-500 text-center">{reservationError}</p>}
                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">
                                予約を確定する
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <hr className="my-12" />

            {/* レビューセクション */}
            <div>
                <h2 className="text-3xl font-bold mb-6">レビュー</h2>
                
                {/* --- ここから修正 --- */}
                {user && (
                    <div className="mb-8">
                        {!showReviewForm ? (
                            <button 
                                onClick={() => setShowReviewForm(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
                            >
                                レビューを投稿する
                            </button>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">レビューを投稿</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block font-bold mb-2">評価</label>
                                        <StarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <div>
                                        <label className="block font-bold mb-1" htmlFor="comment">コメント</label>
                                        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 border rounded h-32" required />
                                    </div>
                                    {reviewError && <p className="text-red-500">{reviewError}</p>}
                                    <div className="flex gap-4">
                                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg">
                                            投稿する
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setShowReviewForm(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
                                        >
                                            キャンセル
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                {/* --- ここまで修正 --- */}

                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {restaurant.reviews.map(review => (
                            <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                                {/* --- ここを修正 --- */}
                                <p className="font-bold text-gray-800">{review.user_username}</p>
                                <div className="my-1"><StarRating rating={review.rating} /></div>
                                <p className="text-gray-600">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">この店舗にはまだレビューがありません。</p>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetailPage;
