import React, { useReducer } from 'react';
import CanvasContext from './canvasContext';
import canvasReducer from './canvasReducer';
import {
  READ_FILE,
  DRAW_BUCKET,
  DRAW_RECTANGLE,
  DRAW_LINE,
  FILE_ERROR,
  OUTPUT_ERROR,
  CLEAR_ERROR,
  CLEAR_OUTPUT
} from './types';

const CanvasState = props => {
  const initialState = {
    input: null,
    output: {},
    error: null,
    outputError: []
  };

  const [state, dispatch] = useReducer(canvasReducer, initialState);

  //Read file
  const readFile = async file => {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      let params = {
        lines: [],
        rectangles: [],
        buckets: []
      };
      reader.onload = e => {
        params.text = e.target.result.split('\n');
        params.text.forEach(row => {
          const rowArr = row.split(' ');
          if (rowArr.indexOf('C') >= 0) {
            if (rowArr.length === 3) {
              if(Number(rowArr[1]) && Number(rowArr[2])){
              params.canvas = {
                width: Number(rowArr[1]),
                height: Number(rowArr[2])
              };
            } else {
              dispatch({
                type: OUTPUT_ERROR,
                payload: `Prohibited coordinates for the canvas`
              });
            }
            }
          } else if (rowArr.indexOf('L') >= 0) {
            if (rowArr.length === 5) {
              params.lines.push({
                start: { x: Number(rowArr[1]), y: Number(rowArr[2]) },
                end: { x: Number(rowArr[3]), y: Number(rowArr[4]) }
              });
            }
          } else if (rowArr.indexOf('R') >= 0) {
            if (rowArr.length === 5) {
              params.rectangles.push({
                start: { x: Number(rowArr[1]), y: Number(rowArr[2]) },
                end: { x: Number(rowArr[3]), y: Number(rowArr[4]) }
              });
            }
          } else if (rowArr.indexOf('B') >= 0) {
            if (rowArr.length === 4) {
              params.buckets.push({
                x: Number(rowArr[1]),
                y: Number(rowArr[2]),
                color: rowArr[3]
              });
            }
          }
        });
        if (params.canvas) {
          resolve(params);
        } else {
          resolve(null);
        }
      };
      reader.readAsText(file);
    });
    if (data) {
      dispatch({
        type: READ_FILE,
        payload: data
      });
    } else {
      dispatch({
        type: FILE_ERROR,
        payload: 'Please, upload correct .txt file!'
      });
    }
  };

  //Set Error
  const setError = err => {
    dispatch({
      type: FILE_ERROR,
      payload: err
    });
  };

  //Clear Error
  const clearError = () => {
    dispatch({
      type: CLEAR_ERROR
    });
  };

  //Clear Output
  const clearOutput = () => {
    dispatch({
      type: CLEAR_OUTPUT
    });
  };

  //Draw border
  const drawLine = (
    elem,
    input,
    drawLines = null,
    param = DRAW_LINE,
    content = 'x'
  ) => {
    const { rectangles, lines } = input;

    let linesContent = [];
    const startX = elem.offsetLeft;
    const startY = elem.offsetTop;

    if (!drawLines) {
      drawLines = lines;
    }

    drawLines.forEach((line, num) => {
      if (
        isNaN(line.start.x) ||
        isNaN(line.start.y) ||
        isNaN(line.end.x) ||
        isNaN(line.end.y)
      ) {
        let type = null;
        switch (param) {
          case DRAW_LINE:
            type = 'line';
            break;
          case DRAW_RECTANGLE:
            type = 'rectangle';
            break;
          case DRAW_BUCKET:
            type = 'bucket';
            break;
          default:
            type = 'line';
        }
        dispatch({
          type: OUTPUT_ERROR,
          payload: `Prohibited coordinates for the ${type}#${num + 1}`
        });
        return;
      }

      let start = null;
      let end = null;
      let vertical = false;

      if (line.start.x === line.end.x) {
        vertical = true;
        start = line.start.y + startY;
        end = line.end.y + startY;
      } else if (line.start.y === line.end.y) {
        start = line.start.x + startX;
        end = line.end.x + startX;
      } else {
        dispatch({
          type: OUTPUT_ERROR,
          payload: `Please, check coordinates for the line#${num +
            1}. This application only supports horizontal or vertical lines!`
        });
        return;
      }

      let revers = start > end;

      for (
        let i = start;
        revers ? i >= end : i <= end;
        i += revers ? -10 : 10
      ) {
        //Prevent duplicates
        let duplicate = false;

        linesContent.forEach(el => {
          if (vertical) {
            if (
              el.top === `${i}px` &&
              el.left === `${line.start.x + startX}px`
            ) {
              duplicate = true;
            }
          } else {
            if (
              el.left === `${i}px` &&
              el.top === `${line.start.y + startY}px`
            ) {
              duplicate = true;
            }
          }
        });

        if (duplicate) {
          continue;
        }

        //Prevent duplicates from bucket
        if (param === DRAW_BUCKET) {
          duplicate = false;
          lines.forEach(l => {
            if (l.left === `${i}px` && l.top === `${line.start.y + startY}px`) {
              duplicate = true;
            }
          });
          rectangles.forEach(rect => {
            if (
              rect.left === `${i}px` &&
              rect.top === `${line.start.y + startY}px`
            ) {
              duplicate = true;
            }
          });

          if (duplicate) {
            continue;
          }
        }

        //Add elements for constructor array
        if (vertical) {
          linesContent.push({
            content: content,
            left: `${line.start.x + startX}px`,
            top: `${i}px`
          });
        } else {
          linesContent.push({
            content: content,
            left: `${i}px`,
            top: `${line.start.y + startY}px`
          });
        }
      }
    });
    dispatch({
      type: param,
      payload: linesContent
    });
  };

  //Draw rectangle
  const drawRectangle = (elem, input) => {
    const { rectangles } = input;
    let lines = [];

    rectangles.forEach((rect, num) => {
      lines.push(
        {
          start: {
            x: rect.start.x,
            y: rect.start.y
          },
          end: {
            x: rect.end.x,
            y: rect.start.y
          }
        },
        {
          start: {
            x: rect.end.x,
            y: rect.start.y
          },
          end: {
            x: rect.end.x,
            y: rect.end.y
          }
        },
        {
          start: {
            x: rect.end.x,
            y: rect.end.y
          },
          end: {
            x: rect.start.x,
            y: rect.end.y
          }
        },
        {
          start: {
            x: rect.start.x,
            y: rect.end.y
          },
          end: {
            x: rect.start.x,
            y: rect.start.y
          }
        }
      );

      drawLine(elem, input, lines, DRAW_RECTANGLE);
    });
  };

  //Bucket Fill
  const bucketFill = (elem, input, output) => {
    const { buckets, canvas } = input;

    buckets.forEach((bucket, num) => {
      if (bucket.x > canvas.width || bucket.y > canvas.height) {
        dispatch({
          type: OUTPUT_ERROR,
          payload: `Bucket's#${num + 1} coordinates outside the canvas border!`
        });
        return;
      }
      let lines = [];
      for (let i = 0; i < bucket.y; i += 10) {
        lines.push({
          start: {
            x: 0,
            y: i
          },
          end: {
            x: bucket.x - 10,
            y: i
          }
        });
      }

      drawLine(elem, output, lines, DRAW_BUCKET, bucket.color);
    });
  };

  return (
    <CanvasContext.Provider
      value={{
        input: state.input,
        output: state.output,
        error: state.error,
        outputError: state.outputError,
        readFile,
        setError,
        clearError,
        drawLine,
        drawRectangle,
        bucketFill,
        clearOutput
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  );
};

export default CanvasState;
