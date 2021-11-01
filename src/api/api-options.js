import { getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAllTags = () => {
	return getRequest(`${config.baseURL}options/getAllTags`);
};


export const updatePublicUserOptions = (payload) => {
	// update product order and base_price_percetage
	return postRequest(`${config.baseURL}options/updatePublicUserOptions`, payload);
};

export const getPublicOption = () => {
	// getPublicOption
	return getRequest(`${config.baseURL}options/getPublicOption`);
};