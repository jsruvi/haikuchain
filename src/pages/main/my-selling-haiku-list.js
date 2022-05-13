import React, { memo, useCallback } from 'react';
import { List } from '../../components/list';
import { useHaikuContext } from '../../hooks';
import { Haiku } from './haiku';

export const MySellingHaikuList = memo(function MySellingHaikuList(props) {
	const { mySellingHaikuList, toggleHaikuSelling } = useHaikuContext();

	const renderToolbar = useCallback(
		({ id }) => (
			<>
				<button onClick={() => toggleHaikuSelling({ id })}>
					Stop selling
				</button>
			</>
		),
		[toggleHaikuSelling]
	);

	const renderItem = useCallback(
		item => (
			<div>
				<Haiku data={item} renderToolbar={renderToolbar} />
			</div>
		),
		[renderToolbar]
	);

	return (
		<List items={mySellingHaikuList} renderItem={renderItem} {...props} />
	);
});
