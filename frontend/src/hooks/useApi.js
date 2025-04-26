import { useState } from 'react';
import axios from 'axios';

const useApi = (url, method = 'GET') => {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios({
                method,
                url,
                params,
            });
            console.log(response);
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        fetchData,
    };
};

export default useApi;