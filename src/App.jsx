import React from 'react';
import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './api/firebaseAuth';
import Router from './router';

const queryClient = new QueryClient();

function App() {
    return (
        
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
