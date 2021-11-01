import React, { useEffect } from 'react';
import useAuth from 'modules/auth/auth.hook';
import history from 'modules/history';
import { PATHS } from 'constants/routes';

export const AuthLayout = () => {
	const { profile, loginByToken, onSignOut } = useAuth();

	history.listen((location, action) => {
		// location is an object like window.location
        // console.log(action, location.pathname, location.state)
	});
	
	useEffect(() => {
		console.log('profile ========>', profile);
	}, [profile]);
	useEffect(() => {
		if (profile.token) {
			loginByToken();
		} else {
			// history.push(PATHS.LOGIN);
		}		
	}, []);

	return <div />;
};
