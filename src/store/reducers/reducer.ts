import { combineReducers } from '@reduxjs/toolkit';
import theme from './theme';
import todos from './todos';

export const reducers = combineReducers({ todos, theme });

export type RootState = ReturnType<typeof reducers>;
