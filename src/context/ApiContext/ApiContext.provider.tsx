import { useRouter } from 'next/router';
import { createContext, useContext, useReducer, useState } from 'react';
import APIReducer from './ApiContext.reducer';

const initialData = {
    data: [],
    page: 1,
};

export const ApiContext = createContext(initialData);

interface ApiContextProviderProps {
    children: React.ReactNode;
}

function ApiContextProvider({ children }: ApiContextProviderProps) {
    const [state, dispatch] = useReducer<any>(APIReducer, initialData);
    const router = useRouter();

    const fetchData = async () => {};

    return (
        <ApiContext.Provider
            value={
                {
                    state,
                    fetchData,
                } as any
            }>
            {children}
        </ApiContext.Provider>
    );
}

export default ApiContextProvider;
