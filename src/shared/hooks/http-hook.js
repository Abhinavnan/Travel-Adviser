import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (method, url, data) => {
        setIsLoading(true);
        setError(null);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        const signal = httpAbortController.signal; 
        try {
            const response = await  axios[method](url, data, {signal})
            const responseData = await response.data;
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController);
            // Remove the abort controller from the active requests when the request is completed
            return responseData;
        } catch (err) {            
            setError(err.response.data.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []); // Cleanup function to abort all requests on component unmount
     // if user navigates away from the page before the request is completed, abort the request
    const clearError = () => {
        setError(null);
    };

    return { isLoading, error, sendRequest, clearError };
}