import React, { memo } from 'react';

const loaderStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'white',
};

export const Loader = memo(function Loader() {
	return <div style={loaderStyle}>Loading...</div>;
});
