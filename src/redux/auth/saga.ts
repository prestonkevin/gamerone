import { call, all, takeLatest, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';

// api
import * as AuthApi from 'api/auth';

// helper
import { getToken, clearToken } from 'utils/token';

// actions
import {
  LOGIN_SUCCESS,
  LOGOUT,
  CHECK_AUTHORIZATION,
  LOGIN_REQUEST,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  CHECK_AUTHORIZATION_SUCCESS,
  LoginAction,
  LoginSuccessAction,
  SignupSuccessAction,
  SignupAction,
} from './types';

import actions from './actions';
import { SignupResponse, LoginResponse } from 'interfaces';
import PostAction from 'redux/post/actions';
import SettingAction from 'redux/settings/actions';
import RequestStatusActions from 'redux/request-status/actions';
import { INIT_STATE, LOAD_STATE } from 'redux/types';

/**
 * Log in
 */
export function* loginRequest() {
  yield takeLatest(LOGIN_REQUEST, function* ({ payload }: LoginAction) {
    yield put(RequestStatusActions.startRequest(LOGIN_REQUEST));
    try {
      const response = yield call(AuthApi.login, payload.request);

      yield put({
        type: LOGIN_SUCCESS,
        payload: response,
      });

      yield put(push(payload.prevPath));
      yield put(RequestStatusActions.finishRequest(LOGIN_REQUEST));
    } catch (err) {
      yield put(RequestStatusActions.finishRequest(LOGIN_REQUEST, err));
    }
  });
}

export function* loginSuccess() {
  yield takeLatest(LOGIN_SUCCESS, function* ({ payload }: LoginSuccessAction) {
    yield localStorage.setItem('id_token', payload.token);
    yield put({ type: LOAD_STATE });
  });
}

export function* logout() {
  yield takeLatest(LOGOUT, function* () {
    clearToken();
    yield put({
      type: INIT_STATE,
    });
    yield put(push('/'));
  });
}

export function* checkAuthorization() {
  yield takeLatest(CHECK_AUTHORIZATION, function* () {
    yield put(RequestStatusActions.startRequest(CHECK_AUTHORIZATION));
    const token = getToken().get('idToken');

    if (token) {
      try {
        const user = yield call(AuthApi.getMe);
        yield put({
          type: CHECK_AUTHORIZATION_SUCCESS,
          payload: { token, user } as LoginResponse,
        });
        yield put(RequestStatusActions.finishRequest(CHECK_AUTHORIZATION));
      } catch (err) {
        yield put({
          type: LOGOUT,
        });
        yield put(RequestStatusActions.finishRequest(CHECK_AUTHORIZATION, err));
      }
    }
  });
}

export function* checkAuthorizationSuccess() {
  yield takeLatest(CHECK_AUTHORIZATION_SUCCESS, function* () {
    yield put({ type: LOAD_STATE });
  });
}

/**
 * Sign up
 */
export function* signUpRequest() {
  yield takeLatest(SIGNUP_REQUEST, function* (action: SignupAction) {
    yield put(RequestStatusActions.startRequest(SIGNUP_REQUEST));
    try {
      const response: SignupResponse = yield call(
        AuthApi.signUp,
        action.payload,
      );
      yield put(actions.signUpSuccess(response));
      yield put(RequestStatusActions.finishRequest(SIGNUP_REQUEST));
    } catch (err) {
      yield put(RequestStatusActions.finishRequest(SIGNUP_REQUEST, err));
    }
  });
}

export function* signUpSuccess() {
  yield takeLatest(SIGNUP_SUCCESS, function* (action: SignupSuccessAction) {
    const { token } = action.payload;
    yield localStorage.setItem('id_token', token || '');
    yield put(push('/signup/avatar'));
  });
}

/**
 * Initialize
 */
export function* loadState() {
  yield takeLatest(LOAD_STATE, function* () {
    yield put(PostAction.loadFeed());
    yield put(SettingAction.loadProfile());
  });
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(checkAuthorizationSuccess),

    fork(loginRequest),
    fork(loginSuccess),

    fork(logout),

    fork(signUpRequest),
    fork(signUpSuccess),

    fork(loadState),
  ]);
}
