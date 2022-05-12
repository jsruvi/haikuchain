import React, {memo} from 'react';
import {logout} from "../../utils";

const style = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white'
}

export const Footer = memo(function Footer(props) {
    return <div style={style} {...props}>
      <div>2022 Haikuchain</div>
    </div>;
  }
);
