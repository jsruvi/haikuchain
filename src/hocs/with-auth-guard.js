import React from 'react';
import { Login } from '../pages/login';

export const withAuthGuard = Component => props => {
	return window.walletConnection.isSignedIn() ? (
		<Component {...props} />
	) : (
		<Login />
	);
};
