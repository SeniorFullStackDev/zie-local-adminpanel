import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StateType, UserType } from 'modules/types';
import * as authAction from './auth.action';

const useAuth = () => {
	const dispatch = useDispatch();

	const profile: UserType = useSelector((state: StateType) => {
		return state.authReducer;
	});

	const onSignin = useCallback(
		(paload) => {
			dispatch(authAction.signInRequestSaga(paload));
		},
		[dispatch],
	);

	const verify2FA = useCallback(
		(paload) => {
			dispatch(authAction.verify2FASaga(paload));
		},
		[dispatch],
	);

	const onSignOut = useCallback(() => {
		dispatch(authAction.signOut());
	}, [dispatch]);

	const loginByToken = useCallback(() => {
		dispatch(authAction.loginByTokenSaga());
	}, [dispatch]);

	return { profile, onSignin, loginByToken, onSignOut, verify2FA };
};

export default useAuth;