// src/components/UpgradePrompt.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradePrompt = ({ featureName }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center bg-gray-100 p-6 rounded-lg mb-8">
      <p className="mb-4">
        {featureName} 機能はプレミアムプランが必要です。
      </p>
      <button
        onClick={() => navigate('/upgrade')}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        アップグレードする
      </button>
    </div>
  );
};

export default UpgradePrompt;
