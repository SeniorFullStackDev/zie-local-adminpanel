import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}redirections?offset=${offset}&limit=${limit}&query=${query}`);
};

export const createRedirection = (data) => {
    return postRequest(`${config.baseURL}redirections`, data);
};

export const updateRedirection = (id, data) => {
    return putRequest(`${config.baseURL}redirections/${id}`, data);
};

export const deleteRedirection = (id) => {
    return deleteRequest(`${config.baseURL}redirections/${id}`);
};

export const getRedirectionDetail = (id) => {
    return getRequest(`${config.baseURL}redirections/detail/${id}`);
};