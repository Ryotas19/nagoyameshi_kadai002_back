import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import MyReservationsPage from './pages/MyReservationsPage';
import UpgradePage from './pages/UpgradePage';
import UpgradeSuccessPage from './pages/UpgradeSuccessPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelledPage from './pages/PaymentCancelledPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import VerificationSentPage from './pages/VerificationSentPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import MyPage from './pages/MyPage';

function App() {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/reservations" element={<MyReservationsPage />} />
                    <Route path="/upgrade" element={<UpgradePage />} />
                    <Route path="/upgrade/success" element={<UpgradeSuccessPage />} />
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
                    <Route path="/payment/cancelled" element={<PaymentCancelledPage />} />
                    <Route path="/password/reset" element={<PasswordResetRequestPage />} />
                    <Route path="/password-reset/confirm/:uid/:token" element={<PasswordResetConfirmPage />} />
                    <Route path="/verification-sent" element={<VerificationSentPage />} />
                    <Route path="/account-confirm-email/:key" element={<EmailVerifiedPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;