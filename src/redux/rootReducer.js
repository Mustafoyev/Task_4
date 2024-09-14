import { combineReducers } from 'redux';
import { tokenReducer } from './token/tokenReducer';

export const rootReducer = combineReducers({
	token: tokenReducer,
});
