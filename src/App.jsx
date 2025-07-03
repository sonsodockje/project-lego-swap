import React from 'react';
import './styles/App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './api/firebaseAuth';

import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import DmPage from './pages/DmPage';
import WritePage from './pages/WritePage';
import Layout from './layout/Layout';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient();

function App() {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
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
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
