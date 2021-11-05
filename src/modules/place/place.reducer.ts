import { createReducer } from 'redux-act';
import * as actions from './place.action';

const initialState = {};

const reducer:any = {
	[actions.setPlace]: (state: any, data: { place: any }) => {
		const { place } = data;
		return { ...place };
	}
};

export default createReducer(reducer, initialState);
