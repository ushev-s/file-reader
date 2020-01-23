import React, { useContext } from 'react';
import CanvasContext from '../../context/canvasContext';

const InputPreview = () => {
  const canvasContext = useContext(CanvasContext);
  const {
    readFile,
    setError,
    error,
    input,
    clearOutput,
    output
  } = canvasContext;
  const fileRef = React.useRef(null);

  const onChange = e => {
    try {
      const file = e.target.files[0];
      if (file.type !== 'text/plain') {
        setError('Please, upload correct .txt file!');
        return;
      }
      if (output) {
        clearOutput();
      }
      readFile(file);
    } catch (err) {
      setError(err);
    }
  };

  const onClick = e => {
    if (input) {
      fileRef.current.value = '';
      clearOutput();
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
      <h5 className='center-align  my-column'>
        Recomended input.txt file data:
      </h5>
      <div className='card-panel hoverable'>
        <p>C 230 100</p>
        <p>L 10 20 60 20</p>
        <p>L 60 30 60 50</p>
        <p>R 160 10 200 30</p>
        <p>B 100 30 o</p>
      </div>
    </div>
  );
};

export default InputPreview;
