import { useState, createContext, useContext, useEffect } from 'react';
import { app } from './firebase'; // Import your Firebase app configuration
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

/**
 * Firebase Authentication Context
 * Provides authentication state and methods for signing in and out.
 */
const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

/**
 * @component AuthProvider
 * Provides authentication context to its children.
 */

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // user 객체가 있으면 로그인, null이면 로그아웃
        });
        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, []);

    // Context를 통해 제공할 값
    const value = {
        currentUser,
        handleSignin,
        handleLogout,
        isLogin: !!currentUser, // currentUser가 null이 아니면 true
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

/**
 * Firebase Authentication Setup
 * Initializes Firebase Authentication with Google provider.
 */
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * @function handleSignin
 * Handles user sign-in with Google.
 * Uses Firebase Authentication to sign in
 */
export const handleSignin = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(token, user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        });
};

/**
 * @function handleLogout
 * Logs out the current user from Firebase Authentication.
 * Redirects to the home page after successful logout.
 */
export const handleLogout = () => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log('User signed out successfully');
            // Redirect to home page or perform any other action
            window.location.href = '/'; // Assuming you want to redirect to the home page
        })
        .catch((error) => {
            // An error happened during sign out
            console.error('Logout error:', error);
        });
};
