import React, { useCallback, memo } from 'react';
import { HaikuForm } from './haiku-form';
import { useHaikuContext } from '../../hooks';

export const AddHaiku = memo(function AddHaiku(props) {
	const { addHaiku } = useHaikuContext();

	const onSubmit = useCallback(
		async ({ values: { text, price }, form }) => {
			await addHaiku({ text, price });
			form.reset();
		},
		[addHaiku]
	);

	return <HaikuForm onSubmit={onSubmit} submitText='Add haiku' {...props} />;
});
