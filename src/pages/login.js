import React from 'react';
import { login } from '../utils';

export const Login = () => (
	<main>
		<h1>Welcome to HAIKUCHAIN!</h1>
		<p>
			To make use of the NEAR blockchain, you need to sign in. The button
			below will sign you in using NEAR Wallet.
		</p>
		<p style={{ textAlign: 'center', marginTop: '2.5em' }}>
			<button onClick={login}>Sign in</button>
		</p>
	</main>
);
