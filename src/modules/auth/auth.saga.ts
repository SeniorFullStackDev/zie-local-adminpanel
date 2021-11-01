import * as actions from './auth.action';
import { takeEvery, put, call } from 'redux-saga/effects';
import { loginByToken, sigin, verify2FACode } from 'api/api-auth';
import history from 'modules/history';
import { PATHS } from 'constants/routes';

function* signInRequest(data: any) {
	const { email, password } = data.payload;
	let response:{body:any};
	try {
		response = yield call(sigin, { email, password });
		yield put(actions.setProfile(response.body));
		if(response.body.google2fa_enabled == 'no'){
			history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}`);	
		}
	} catch (e) {
		console.log(e);
	}
}

function* verify2FA(data:any) {
	const {email, code } = data.payload;
	let response:{body:any};
	try {
		response = yield call(verify2FACode, { email, code });
		yield put(actions.setProfile(response.body));
		history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}`);
	} catch (e) {
		console.log(e);
	}
}

function* loginByTokenRequest() {
	try {
		const response:{body:any} = yield call(loginByToken);
		yield put(actions.setProfile(response.body));
	} catch (e) {
		console.log(e);
	}
}

export default function* watchAuthSaga() {
	// yield fork(loginWatcherSaga);
	yield takeEvery(actions.signInRequestSaga, signInRequest);
	// yield takeEvery(actions.signOutSaga, signOut);
	yield takeEvery(actions.loginByTokenSaga, loginByTokenRequest);
	yield takeEvery(actions.verify2FASaga, verify2FA);
}
