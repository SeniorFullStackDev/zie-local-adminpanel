import { getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const sigin = (payload) => {
	return postRequest(`${config.baseURL}auth/admin/login`, payload);
};
export const verify2FACode = (payload) => {
	return postRequest(`${config.baseURL}auth/admin/verify_2fa_code`, payload);
};

export const loginByToken = () => {
	return postRequest(`${config.baseURL}auth/admin/loginByToken`);
};

export const resetpassword = (payload) => {
	return postRequest(`${config.baseURL}auth/admin/reset_password`, payload);
};