import React, {memo} from 'react';
import {Section} from '../../components/section';
import {Header} from './header';
import {Footer} from './footer';
import {HaikuForm} from './haiku-form';
import './styles.css';

const mainStyle = {
  display: 'grid',
  flexDirection: 'column',
  height: '100vh',
  background: 'black',
  gridTemplateAreas: `"header header header header" "form created selling another-selling"  "footer footer footer footer"`,
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: '50px 1fr 50px',
  gap: '1px'
}

const items = [
  {
    area: 'header',
    content: <Header/>,
  },
  {
    title: 'Add haiku',
    area: 'form',
    content: <HaikuForm />,
  },
  {
    title: 'My haiku',
    area: 'created',
    content: null,
  },
  {
    title: 'My selling haiku',
    area: 'selling',
    content: null,
  },
  {
    title: 'Another selling haiku',
    area: 'another-selling',
    content: null,
  },
  {
    area: 'footer',
    content: <Footer />,
  },
].map(({title, area, content}) => (
  <Section title={title} style={{ gridArea: area }}>{content}</Section>
))

export const Main = memo(function Main(props) {
  return <div style={mainStyle} {...props}>{items}</div>;
  }
);
