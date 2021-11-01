import { getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAllTags = () => {
	return getRequest(`${config.baseURL}tags/all`);
};

export const createNewTag = (payload) => {
    return postRequest(`${config.baseURL}tags/create`, payload);
};

export const deleteTag = (payload) => {
	return postRequest(`${config.baseURL}tags/delete`, { ID: payload });
};

export const updateTag = (payload) => {
	return postRequest(`${config.baseURL}tags/update`, payload);
};