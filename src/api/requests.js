import superAgent from 'superagent';
import superAgentIntercept from 'superagent-intercept';
import history from 'modules/history';
import { PATHS } from 'constants/routes';

const ErrorIntercept = superAgentIntercept((err, res) => {
	if(err){
		localStorage.removeItem('token');
		window.location.href = 'https://adminpanel-zielonamapa-azure.vercel.app/';
		return;
	}
	if (res.status === 401 || res.status === 403) {
		localStorage.removeItem('token');
		history.push(PATHS.LOGIN);
	}
});

export const getRequest = (route) => {
	return new Promise((resolve, reject) =>
		superAgent
			.get(route)
			.use(ErrorIntercept)
			.set({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			})
			.then((response) => resolve(response))
			.catch((error) => reject(error)),
	);
};

export const postRequest = (route, details) =>
	new Promise((resolve, reject) =>
		superAgent
			.post(route)
			.use(ErrorIntercept)
			.set({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			})
			.send(details)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			}),
	);

export const putRequest = (route, details) =>
	new Promise((resolve, reject) =>
		superAgent
			.put(route)
			.use(ErrorIntercept)
			.set({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			})
			.send(details)
			.then((response) => resolve(response))
			.catch((error) => reject(error)),
	);

export const patchRequest = (route, details) =>
	new Promise((resolve, reject) =>
		superAgent
			.patch(route)
			.use(ErrorIntercept)
			.set({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			})
			.send(details)
			.then((response) => resolve(response))
			.catch((error) => reject(error)),
	);

export const deleteRequest = (route) =>
	new Promise((resolve, reject) =>
		superAgent
			.delete(route)
			.use(ErrorIntercept)
			.set({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			})
			.then((response) => resolve(response))
			.catch((error) => reject(error)),
	);
