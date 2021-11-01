import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}admin?offset=${offset}&limit=${limit}&query=${query}`);
};

export const deleteAdmin = (adminId) => {
    return deleteRequest(`${config.baseURL}admin/${adminId}`);
};

export const getAdminDetail = (adminId) => {
    return getRequest(`${config.baseURL}admin/${adminId}`);
};

export const updateAdminDetail = (adminId, data) => {
    return putRequest(`${config.baseURL}admin/${adminId}`, data);
};

export const createNewAdmin = (data) => {
    return postRequest(`${config.baseURL}admin/register`, data);
};

export const sendResetPasswordLink = (email) => {
    return postRequest(`${config.baseURL}admin/send_reset_password_link`, { email });
};

export const updateAdminRole = (id, role) => {
    return postRequest(`${config.baseURL}admin/update_role/${id}`, { role });
};

export const getNew2FAQRCode = () => {
    return postRequest(`${config.baseURL}admin/get_2FA_qrcode`);
};

export const testG2faVerify = (payload) => {
	return postRequest(`${config.baseURL}admin/test_g2fa_verify`, payload);
};