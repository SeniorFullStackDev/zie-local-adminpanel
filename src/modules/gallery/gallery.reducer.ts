import { createReducer } from 'redux-act';
import * as actions from './gallery.action';

const initialState: any = {
	photos: [],
	paginationOption: {total:0, curPage:1, pageSize:48},
};

const reducer:any = {
	[actions.setPhotos]: (state: any, data: { photos: any[] }) => {
		const { photos } = data;
		return { ...state, photos };
	},
	[actions.setPaginationOption]: (state: any, data: { paginationOption: any[] }) => {
		const { paginationOption } = data;
		return { ...state, paginationOption };
	}
};

export default createReducer(reducer, initialState);
