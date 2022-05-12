import React, {memo} from 'react';
import './styles.css';

export const Section = memo(function Section({title, children, ...props}) {
    return <div className='section' {...props}>
      {title ? <div className='section__title'>{title}</div> : null}
      <div className="section__holder">{children}</div>
    </div>;
  }
);
