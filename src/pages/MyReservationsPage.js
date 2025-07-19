import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const MyReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    const fetchReservations = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/reservations/');
            setReservations(response.data);
        } catch (error) {
            console.error("予約情報の取得に失敗しました", error);
        }
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleCancel = async (reservationId) => {
        if (window.confirm('この予約をキャンセルしますか？')) {
            try {
                await axiosInstance.delete(`/reservations/${reservationId}/`);
                fetchReservations();
            } catch (error) {
                console.error("予約のキャンセルに失敗しました", error);
                alert("予約のキャンセルに失敗しました。");
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">予約一覧</h1>
            {reservations.length > 0 ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {reservations.map(res => (
                        <div key={res.id} className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{res.restaurant_name}</h2>
                                <p className="text-gray-600 mt-2">日時: {res.reservation_date} {res.reservation_time.slice(0, 5)}</p>
                                <p className="text-gray-600">人数: {res.number_of_people} 名</p>
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleCancel(res.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={() => navigate(`/restaurants/${res.restaurant}`)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    詳細
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">現在、予約はありません。</p>
            )}
        </div>
    );
};

export default MyReservationsPage;
