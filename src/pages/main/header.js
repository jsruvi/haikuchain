import React, {memo} from 'react';
import {logout} from "../../utils";

const style = {
  display: 'flex',
  height: '100%',
  position: 'relative',
  alignItems: 'center',
  background: 'white'
}

const logoStyle = {
  fontSize: '30px',
  lineHeight: '30px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  margin: '0 0 0 auto'
}

export const Header = memo(function Header(props) {
    return <div style={style} {...props}>
      <div style={logoStyle}>Haikuchain</div>
      <div style={userInfoStyle}>
        {window.accountId}
        <button className="link" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>;
  }
);
