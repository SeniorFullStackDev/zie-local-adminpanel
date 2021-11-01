import { getRequest, postRequest, putRequest, deleteRequest } from './requests';
import config from './config';

export const getAllRegions = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}regions?offset=${offset}&limit=${limit}&query=${query}`);
};

export const createRegion = (data) => {
    return postRequest(`${config.baseURL}regions`, data);
};

export const updateRegion = (id, data) => {
    return putRequest(`${config.baseURL}regions/${id}`, data);
};

export const deleteRegion = (id) => {
    return deleteRequest(`${config.baseURL}regions/${id}`);
};