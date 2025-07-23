
import React, { createContext, useContext, useState } from 'react';

const CommentCountContext = createContext(null);

export function CommentCountContextProvider({ children }) {
    const [count, setCount] = useState(null);


        


    const contextValue = {
        count,
        setCount
    };

    return (
        <CommentCountContext.Provider value={contextValue}>
            {children}
        </CommentCountContext.Provider>
    );
}
export function useCommentCountContext() {
    return useContext(CommentCountContext);
}