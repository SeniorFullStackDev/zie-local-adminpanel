import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from 'pages/login';
import Dashboard from 'pages/dashboard';
import AnalysticPhotos from 'pages/Analystic/Photos';

import { PATHS } from 'constants/routes';
import { AuthLayout } from 'pages/auth';

function App() {
	console.log('app loading ...');
	return (
		<>
			<AuthLayout />
			<Switch>
				<Route exact path={PATHS.LOGIN} component={LoginPage} />
				<Route path={`${PATHS.DASHBOARD}`} component={Dashboard} />
				<Route path={`${PATHS.ANALYSTIC_PHOTO}`} component={AnalysticPhotos} />
				{/* <Route exact path={`${PATHS.DASHBOARD}/:menu_item`} component={Dashboard} /> */}
			</Switch>
		</>
	);
}

export default App;
