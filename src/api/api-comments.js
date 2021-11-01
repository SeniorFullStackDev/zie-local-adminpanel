import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}comments?offset=${offset}&limit=${limit}&query=${query}`);
};

export const getCommentDetail = (commentId) => {
    return getRequest(`${config.baseURL}comments/detail/${commentId}`);
};

export const searchComments = (query) => {
    return getRequest(`${config.baseURL}comments/search/${query}`);
};

export const updateCommentDetail = (commentId, data) => {
    return putRequest(`${config.baseURL}comments/${commentId}`, data);
};

export const deleteComment = (commentId) => {
    return deleteRequest(`${config.baseURL}comments/${commentId}`);
};

export const createComment = (data) => {
    return postRequest(`${config.baseURL}comments`, data);
};