import React, { useContext, useEffect } from 'react';
import CanvasContext from '../../context/canvasContext';

const OutPutPreview = () => {
  const canvasContext = useContext(CanvasContext);
  const { setError, error, input, drawLine, lines } = canvasContext;
  const canvasRef = React.useRef(null);

  useEffect(() => {
    let elem = canvasRef.current;
    if (input) {
      drawLine(elem, input.lines);
    }
    //eslint-disable-next-line
  }, [input]);

  return (
    <div className='col s6'>
      <h5 className='center-align'>Result preview</h5>
      <div className='card-panel hoverable'>
        {input ? (
          <div
            style={{
              border: 'dashed',
              width: `${input.canvas.width}px`,
              height: `${input.canvas.height}px`
            }}
            ref={canvasRef}
          >
            {lines &&
              lines.map((line, index) => (
                <div
                  key={index}
                  data-content={line.content}
                  style={{ left: line.left, top: line.top }}
                  className='symbol-container'
                ></div>
              ))}
          </div>
        ) : (
          'Whaiting for input txt file...'
        )}
      </div>
    </div>
  );
};

export default OutPutPreview;
