import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './api/firebaseAuth';

import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import DmPage from './pages/DmPage';
import WritePage from './pages/WritePage';
import Layout from './layout/Layout';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<MainPage />} />
                        <Route path='account' element={<MyPage />} />
                        <Route path='message' element={<DmPage />} />
                        <Route path='detail/:id' element={<DetailPage />} />
                        <Route path='write' element={<WritePage />} />
                        <Route path='/write/:id' element={<WritePage />} />
                        {/* <Route path="/posts/:id" element={<PostDetail />} /> */}

                        <Route path='*' element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

// pnpm exec prettier . --write
