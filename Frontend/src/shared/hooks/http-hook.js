import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import axios from 'axios';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);
    const auth = useContext(AuthContext); 

    const sendRequest = useCallback(async (method, url, data) => {
        setIsLoading(true);
        setError(null);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        const signal = httpAbortController.signal; 
 
        try {
            let response;
            if(method === 'delete'){
                response = await axios[method](url, { signal, headers: { 'Authorization': `Bearer ${auth.token}` }})
                // axios delete method does not accept data as a parameter
            }else{
                response = await axios[method](url, data, { signal, headers: { 'Authorization': `Bearer ${auth.token}` }}) }             
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