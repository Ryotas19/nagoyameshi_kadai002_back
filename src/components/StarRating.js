import React from 'react';

const StarRating = ({ rating, setRating }) => {
    const isClickable = !!setRating; // setRatingが渡された場合のみクリック可能

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-2xl ${isClickable ? 'cursor-pointer' : ''} ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => isClickable && setRating(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;