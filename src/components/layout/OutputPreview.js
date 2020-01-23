import React, { useContext, useEffect } from 'react';
import CanvasContext from '../../context/canvasContext';

const OutPutPreview = () => {
  const canvasContext = useContext(CanvasContext);
  const {
    input,
    output,
    drawLine,
    drawRectangle,
    bucketFill,
    outputError,
    clearError
  } = canvasContext;
  const canvasRef = React.useRef(null);

  useEffect(() => {
    let elem = canvasRef.current;

    if (outputError.length > 0) {
      clearError();
    }

    if (input) {
      drawLine(elem, input);
      drawRectangle(elem, input);
    }
    //eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    let elem = canvasRef.current;

    if ((output.lines || output.rectangles) && input && !output.buckets) {
      bucketFill(elem, input, output);
    }
    //eslint-disable-next-line
  }, [output]);

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
            {output.lines &&
              output.lines.map((line, index) => (
                <div
                  key={index}
                  data-content={line.content}
                  style={{ left: line.left, top: line.top }}
                  className='symbol-container'
                ></div>
              ))}
            {output.rectangles &&
              output.rectangles.map((rect, index) => (
                <div
                  key={index}
                  data-content={rect.content}
                  style={{ left: rect.left, top: rect.top }}
                  className='symbol-container'
                ></div>
              ))}
            {output.buckets &&
              output.buckets.map((bucket, index) => (
                <div
                  key={index}
                  data-content={bucket.content}
                  style={{ left: bucket.left, top: bucket.top }}
                  className='symbol-container'
                ></div>
              ))}
          </div>
        ) : (
          'Whaiting for input txt file...'
        )}
      </div>
      <div>
        {outputError.length > 0 &&
          outputError.map((err, index) => (
            <p key={index} className='red-text'>
              {err}
            </p>
          ))}
      </div>
    </div>
  );
};

export default OutPutPreview;
