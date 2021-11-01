import { getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = () => {
	return getRequest(`${config.baseURL}consultants/all`);
};

export const createNewConsultant = (payload) => {
	return postRequest(`${config.baseURL}consultants/create`, payload);
};

export const deleteConsultant = (payload) => {
	return postRequest(`${config.baseURL}consultants/delete`, { ID: payload });
};

export const getById = (payload) => {
	return getRequest(`${config.baseURL}consultants?ID=${payload}`);
};

export const update = (payload) => {
	return postRequest(`${config.baseURL}consultants/update`, payload);
};
