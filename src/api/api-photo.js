import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}photos?offset=${offset}&limit=${limit}&query=${query}`);
};

export const getPhotoDetail = (placeId) => {
    return getRequest(`${config.baseURL}photos/detail/${placeId}`);
};

export const searchPhotos = (query) => {
    return getRequest(`${config.baseURL}photos/search/${query}`);
};


export const updatePhotoDetail = (placeId, data) => {
    return putRequest(`${config.baseURL}photos/${placeId}`, data);
};

export const deletePhoto = (placeId) => {
    return deleteRequest(`${config.baseURL}photos/${placeId}`);
};

export const deletePhotos = (photoIds) => {
    return postRequest(`${config.baseURL}photos/delete`, {ids: photoIds});
};

export const createPhoto = (data) => {
    return postRequest(`${config.baseURL}photos`, data);
};