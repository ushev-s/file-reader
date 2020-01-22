import React from 'react';
import InputPreview from './InputPreview';
import OutputPreview from './OutputPreview';

const Home = () => {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col s12 center my-column'></div>
        <InputPreview />
        <OutputPreview />
      </div>
    </div>
  );
};

export default Home;
