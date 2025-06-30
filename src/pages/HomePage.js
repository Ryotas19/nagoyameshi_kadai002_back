import React, { useState, useEffect, useCallback, useContext } from 'react'; // useContext をインポート
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AuthContext from '../context/AuthContext'; // AuthContext をインポート
import './HomePage.css';

// ... (carouselImages の定義は変更なし)
const carouselImages = [
    {
        name: '味噌カツ',
        url: 'https://thumb.photo-ac.com/fc/fc8a7c0165a79d4d71037ed1ced8a9b7_w.jpeg'
    },
    {
        name: '親子丼',
        url: 'https://www.tabemaro.jp/wp-content/uploads/2023/11/2311_nagoyako-chinoyakodon.jpg'
    },
    {
        name: '天むす',
        url: 'https://thumb.photo-ac.com/b0/b0decda91029e5f8655de4ad81c0929f_w.jpeg'
    },
    {
        name: 'あんかけスパ', 
        url: 'https://www.tabemaro.jp/wp-content/uploads/2023/03/ankakesupagettei-1.jpg'
    }
];


// ... (RestaurantCard コンポーネントは変更なし)
const RestaurantCard = ({ restaurant }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <img src={restaurant.image || 'https://placehold.co/600x400/F0AD4E/FFFFFF?text=NAGOYAMESHI'} alt={restaurant.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
            <p className="text-gray-600 mt-1 flex-grow">{restaurant.description}</p>
            <p className="text-sm text-gray-500 mt-2">カテゴリ: {restaurant.category_name || '未分類'}</p>
            <p className="text-sm text-yellow-500">平均評価: {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : '評価なし'}</p>
            <div className="text-right mt-4">
                 <Link to={`/restaurants/${restaurant.id}`} className="text-yellow-500 hover:text-yellow-600 font-bold">詳しく見る</Link>
            </div>
        </div>
    </div>
);


const HomePage = () => {
    const { user } = useContext(AuthContext); // user情報を取得
    const [activeIndex, setActiveIndex] = useState(0);
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [ordering, setOrdering] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchRestaurants = useCallback(async () => {
        try {
            const params = { search, category, ordering };
            const response = await axiosInstance.get('/restaurants/', { params });
            setRestaurants(response.data);
        } catch (error) {
            console.error('店舗情報の取得に失敗しました', error);
        }
    }, [search, category, ordering]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('カテゴリの取得に失敗しました', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    return (
        <div>
            {/* カルーセルヒーローセクション */}
            <div className="carousel-container">
                {carouselImages.map((image, index) => (
                    <div
                        key={image.name}
                        className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image.url})` }}
                    />
                ))}
                <div className="carousel-content">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">名古屋ならではの味を、見つけよう</h1>
                    {/* ここでユーザー名を表示 */}
                    {user ? (
                         <p className="text-xl md:text-2xl mb-8">ようこそ, {user.username}さん！</p>
                    ) : (
                         <p className="text-xl md:text-2xl mb-8">NAGOYAMESHIは、名古屋市のB級グルメ専門のレビューサイトです。</p>
                    )}
                </div>
            </div>

            {/* 店舗一覧セクション */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold text-center mb-8">店舗を探す</h2>
                
                <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap items-center gap-4">
                    <input 
                        type="text"
                        placeholder="キーワードで検索..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded-md flex-grow"
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md bg-white">
                        <option value="">すべてのカテゴリ</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <select value={ordering} onChange={(e) => setOrdering(e.target.value)} className="border p-2 rounded-md bg-white">
                        <option value="">標準</option>
                        <option value="-avg_rating">評価の高い順</option>
                        <option value="avg_rating">評価の低い順</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
