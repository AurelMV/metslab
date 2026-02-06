import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url, method = 'GET', body = null, auto = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(auto); // solo loading si `auto` es true
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0); // para refetch manual

  // Fetch automático si method es GET y auto = true
  useEffect(() => {
    if (method.toUpperCase() === 'GET' && auto) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(url);
          setData(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [url, method, auto, trigger]);

  // Función para realizar solicitudes con otros métodos
  const execute = async (options = {}) => {
    const { body: newBody = null, method: customMethod = method, ...axiosOptions } = options;
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url,
        method: customMethod.toUpperCase(),
        data: newBody,
        ...axiosOptions,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error en la solicitud';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => setTrigger(t => t + 1);

  return {
    data,
    loading,
    error,
    execute, // llama con el método que quieras: POST, PUT, DELETE, PATCH
    refetch, // para forzar un nuevo GET si necesitas
  };
};

export default useFetch;
