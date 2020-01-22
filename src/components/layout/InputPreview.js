import React, { useContext } from 'react';
import CanvasContext from '../../context/canvasContext';

const InputPreview = () => {
  const canvasContext = useContext(CanvasContext);
  const { readFile, setError, error, input } = canvasContext;
  const fileRef = React.useRef(null);

  const onChange = e => {
    try {
      const file = e.target.files[0];
      if (file.type !== 'text/plain') {
        setError('Please, upload correct .txt file!');
        return;
      }
      readFile(file);
    } catch (err) {
      setError(err);
    }
  };

  const onClick = e => {
    if (input) {
      fileRef.current.value = '';
    }
  };

  return (
    <div className='col s6'>
      <h5 className='center-align'>File content preview</h5>
      <div className='card-panel hoverable'>
        {input
          ? input.text.map((row, i) => {
              return <p key={i}>{row}</p>;
            })
          : 'File content...'}
      </div>
      <div className='file-field input-field'>
        <div className='btn' onClick={onClick}>
          <span>Upload File</span>
          <input type='file' ref={fileRef} onChange={onChange} />
        </div>
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>
      <div>{error && <span className='red-text'>{error}</span>}</div>
    </div>
  );
};

export default InputPreview;
