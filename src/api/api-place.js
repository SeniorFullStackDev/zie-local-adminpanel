import { deleteRequest, getRequest, postRequest, putRequest } from './requests';
import config from './config';

export const getAll = (offset=0, limit=20, query='') => {
	return getRequest(`${config.baseURL}places?offset=${offset}&limit=${limit}&query=${query}`);
};

export const getPlaceDetail = (placeId) => {
    return getRequest(`${config.baseURL}places/detail/ids/${placeId}`);
};

export const searchPlaces = (query) => {
    return getRequest(`${config.baseURL}places/search/${query}`);
};

export const getAllPlacesWithTitle = (excludeId) => {
    return getRequest(`${config.baseURL}places/all?excludeId=${excludeId}`);
};

export const updatePlaceDetail = (placeId, data) => {
    return putRequest(`${config.baseURL}places/${placeId}`, data);
};

export const deletePlace = (placeId) => {
    return deleteRequest(`${config.baseURL}places/${placeId}`);
};

export const createPlace = (data) => {
    return postRequest(`${config.baseURL}places`, data);
};

export const createGalleryItem = (data) => {
    return postRequest(`${config.baseURL}places/gallery`, data);
};

export const updateGalleryItem = (galleryId, data) => {
    return putRequest(`${config.baseURL}places/gallery/${galleryId}`, data);
};

export const deleteGalleryItem = (galleryId) => {
    return deleteRequest(`${config.baseURL}places/gallery/${galleryId}`);
};

export const createCityContent = (data) => {
    return postRequest(`${config.baseURL}places/citycontent`, data);
};

export const updateCityContent = (id, data) => {
    return putRequest(`${config.baseURL}places/citycontent/${id}`, data);
};

export const deleteCityContent = (id) => {
    return deleteRequest(`${config.baseURL}places/citycontent/${id}`);
};

export const scrapeHotelDetailFromBookingCom = (hotel_link) => {
    return postRequest(`${config.baseURL}places/hotels/scrape`, { hotel_link });
};

export const createHotel = (data) => {
    return postRequest(`${config.baseURL}places/hotels`, data);
};

export const updateHotel = (id, data) => {
    return putRequest(`${config.baseURL}places/hotels/${id}`, data);
};

export const deleteHotel = (id) => {
    return deleteRequest(`${config.baseURL}places/hotels/${id}`);
};
export const createExternalLink = (data) => {
    return postRequest(`${config.baseURL}places/externallinks`, data);
};

export const updateExternalLink = (id, data) => {
    return putRequest(`${config.baseURL}places/externallinks/${id}`, data);
};

export const deleteExternalLink = (id) => {
    return deleteRequest(`${config.baseURL}places/externallinks/${id}`);
};

export const getComments = (placeId, offset=0, limit=20, query ='') => {
    return getRequest(`${config.baseURL}comments/places/${placeId}?offset=${offset}&limit=${limit}&query=${query}`);
};

export const saveSEOData = (placeId, data) => {
    return postRequest(`${config.baseURL}places/seo/${placeId}`, data);
};

export const getAllContinents = () => {
    return getRequest(`${config.baseURL}places/all/continents`);
};

export const getAllCountries = () => {
    return getRequest(`${config.baseURL}places/all/coutries`);
};

export const getAllCities = (country_id) => {
    return getRequest(`${config.baseURL}places/${country_id}/children/city`);
};

export const createCategoryPage = (data) => {
    return postRequest(`${config.baseURL}places/category`, data);
};

export const deleteCategoryPage = (id) => {
    return deleteRequest(`${config.baseURL}places/category/${id}`);
};

export const getAllCitiesForPhotoAnalystic = () => {
    return getRequest(`${config.baseURL}places/get_all_cities`);
};

export const createHomeCategoryLinks = (payload) => {
    return postRequest(`${config.baseURL}pages/home/category_links`, payload);
};


export const updateHomeCategoryLinks = (payload) => {
    return putRequest(`${config.baseURL}pages/home/category_links`, payload);
};

export const deleteHomeCategoryLinks = (id) => {
    return deleteRequest(`${config.baseURL}pages/home/category_links/${id}`);
};
