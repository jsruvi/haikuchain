import React, { memo } from 'react';
import { List } from '../../components/list';
import { useHaikuContext } from '../../hooks';
import { Haiku } from './haiku';

const Toolbar = ({ id, price }) => {
	const { buyHaiku } = useHaikuContext();

	return (
		<button
			onClick={() => {
				buyHaiku({ id, price });
			}}
		>
			Buy
		</button>
	);
};

const renderToolbar = ({ id, text, price, selling }) => (
	<Toolbar id={id} selling={selling} text={text} price={price} />
);

const renderItem = item => <Haiku data={item} renderToolbar={renderToolbar} />;

export const AnotherHaikuList = memo(function AnotherHaikuList(props) {
	const { anotherHaikuList } = useHaikuContext();

	return <List items={anotherHaikuList} renderItem={renderItem} {...props} />;
});
