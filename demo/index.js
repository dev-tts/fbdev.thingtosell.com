'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from '../src/facebook';

const responseFacebook = (response) => {
  console.log(response);
}

ReactDOM.render(
  <FacebookLogin
    appId="1517651635230972"
    autoLoad={true}
    callback={responseFacebook} />,
  document.getElementById('demo')
);
