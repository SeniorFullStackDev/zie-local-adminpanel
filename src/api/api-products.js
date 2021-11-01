import { getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = () => {
	return getRequest(`${config.baseURL}products/getAll`);
};

export const getAllPublishedProducts = () => {
	return getRequest(`${config.baseURL}products/all`);
};

export const createProduct = (payload) => {
	return postRequest(`${config.baseURL}products/create`, payload);
};

export const updateProduct = (payload) => {
	return postRequest(`${config.baseURL}products/update`, payload);
};

export const draftProduct = (payload) => {
	return postRequest(`${config.baseURL}products/draft`, { ID: payload });
};
export const deleteProduct = (payload) => {
	return postRequest(`${config.baseURL}products/delete`, { ID: payload });
};

export const publishProduct = () => {
	return postRequest(`${config.baseURL}products/publish`, { ID: payload });
};

export const getProductById = (payload) => {
	return getRequest(`${config.baseURL}products/detail?productId=${payload}`);
};

export const getAllPublishedProductsInOrder = (consultantId) => {
	return postRequest(`${config.baseURL}products/all/order`, {consultantId});
};
