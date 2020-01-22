import React, { Fragment, useEffect } from 'react';
import CanvasState from './context/CanvasState';
import Home from './components/layout/Home';

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import './App.css';

const App = () => {
  useEffect(() => {
    // Init Materialize JS
    M.AutoInit();
  });

  return (
    <CanvasState>
      <Fragment>
        <Home />
      </Fragment>
    </CanvasState>
  );
};

export default App;
