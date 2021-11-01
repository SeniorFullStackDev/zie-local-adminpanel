import { UserType } from 'modules/types';
import { createReducer } from 'redux-act';
import * as actions from './auth.action';

const initialState: UserType = {
	name: '',
	email: '',
	role:'',
	token: localStorage.getItem('token') || undefined,
};

const reducer:any = {
	[actions.setProfile]: (state: any, data: { profile: UserType }) => {
		const { profile } = data;
		//save token in local storage
		if (profile.token) localStorage.setItem('token', profile.token);
		
		return { ...profile };
	},
	[actions.signOut]: (state: any) => {
		//save token in local storage
		// if (profile.token) localStorage.setItem('token', profile.token);
		localStorage.clear();
		const profile = initialState;
		return { ...profile, token:undefined };
	},
};

export default createReducer(reducer, initialState);
