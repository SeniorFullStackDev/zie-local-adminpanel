import { createAction } from 'redux-act';
import { UserType } from 'modules/types';

export const signInRequestSaga: any = createAction('signInRequestSaga');
export const verify2FASaga: any = createAction('verify2FASaga');
export const signOut: any = createAction('signOut');
export const loginByTokenSaga: any = createAction('loginByTokenSaga');
export const setProfile: any = createAction('setProfile', (profile: UserType) => ({ profile }));
