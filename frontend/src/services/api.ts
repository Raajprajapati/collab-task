import axios from 'axios';
import { errors } from '../utils/errors';

const api = axios.create({
    withCredentials: true,
});


// response interceptor to handle errors and return respected messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            return Promise.reject(errors.UNAUTHORIZED);
        }
        if (error.response && error.response.status === 403) {
            return Promise.reject(errors.FORBIDDEN);
        }
        if (error.response && error.response.status === 404) {
            return Promise.reject(errors.NOT_FOUND);
        }
        if (error.response && error.response.status === 500) {
            return Promise.reject(errors.INTERNAL_SERVER_ERROR);
        }
        return Promise.reject(error);
    }
);

export default api;
