import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
// import blockchain from "./blockchain/blockchain.reducer";
// import blockchain from "./blockchain/blockchain.reducer";
import authReducer from './auth/auth.reducer';
import galleryReducer from './gallery/gallery.reducer';
import watchAuthSaga from './auth/auth.saga';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  authReducer,
  galleryReducer,
});

const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f,
  ),
);

sagaMiddleware.run(watchAuthSaga);

export default store;
