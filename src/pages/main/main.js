import React, { memo } from 'react';
import { Section } from '../../components/section';
import { Header } from './header';
import { Footer } from './footer';
import { AddHaiku } from './add-haiku';
import { MyHaikuList } from './my-haiku-list';
import { AnotherHaikuList } from './another-haiku-list';
import { MySellingHaikuList } from './my-selling-haiku-list';
import { HaikuContext } from '../../contexts';
import './styles.css';
import { useHaiku } from '../../hooks';
import { withAuthGuard } from '../../hocs';

const mainStyle = {
	display: 'grid',
	flexDirection: 'column',
	height: '100vh',
	background: 'black',
	gridTemplateAreas: `"header header header header" "form created selling another-selling"  "footer footer footer footer"`,
	gridTemplateColumns: 'repeat(4, 1fr)',
	gridTemplateRows: '50px 1fr 50px',
	gap: '1px',
};

const items = [
	{
		area: 'header',
		content: <Header />,
	},
	{
		title: 'Add haiku',
		area: 'form',
		content: <AddHaiku />,
	},
	{
		title: 'My haiku',
		area: 'created',
		content: <MyHaikuList />,
	},
	{
		title: 'My selling haiku',
		area: 'selling',
		content: <MySellingHaikuList />,
	},
	{
		title: 'Selling haiku from another people',
		area: 'another-selling',
		content: <AnotherHaikuList />,
	},
	{
		area: 'footer',
		content: <Footer />,
	},
].map(({ title, area, content }, index) => (
	<Section key={index} title={title} style={{ gridArea: area }}>
		{content}
	</Section>
));

export const Main = withAuthGuard(function Main(props) {
	const contextValue = useHaiku();

	return (
		<HaikuContext.Provider value={contextValue}>
			<div style={mainStyle} {...props}>
				{items}
			</div>
		</HaikuContext.Provider>
	);
});
