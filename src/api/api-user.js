import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}users?offset=${offset}&limit=${limit}&query=${query}`);
};

export const deleteUser = (userId) => {
    return deleteRequest(`${config.baseURL}users/${userId}`);
};

export const sendPasswordResetLink = (email) => {
    return postRequest(`${config.baseURL}email/send_reset_password`, { email });
};

export const getAllfakeUsers = () => {
    return getRequest(`${config.baseURL}users/get_all_fake_users`);
};

export const getUserDetailById = (user_id) => {
    return getRequest(`${config.baseURL}users/ids/${user_id}`);
};

export const createNewUser = (payload) => {
    return postRequest(`${config.baseURL}users/create`, payload);
};