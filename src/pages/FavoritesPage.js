import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axiosInstance.get('/favorites/');
                setFavorites(response.data);
            } catch (error) {
                console.error("お気に入りの取得に失敗しました", error);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">お気に入り店舗</h1>
            {favorites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map(fav => (
                        <div key={fav.id} className="bg-white rounded-lg shadow-lg p-4">
                            <h2 className="text-xl font-bold">{fav.restaurant.name}</h2>
                            <p className="text-gray-600 mt-2">{fav.restaurant.description}</p>
                            <div className="text-right mt-4">
                                <Link to={`/restaurants/${fav.restaurant.id}`} className="text-yellow-500 font-bold">詳しく見る</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">お気に入りに登録された店舗はまだありません。</p>
            )}
        </div>
    );
};

export default FavoritesPage;
