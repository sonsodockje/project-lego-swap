import './styles/App.css';
import Router from './router';

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './api/firebaseAuth';
import { ThemeProvider } from './hooks/useTheme';
import { CommentCountContextProvider } from './hooks/useCommentSuContext';

const queryClient = new QueryClient();

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme='bumblebee'>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <CommentCountContextProvider>
                            <Router />
                        </CommentCountContextProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
