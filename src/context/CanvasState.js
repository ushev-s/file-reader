import React, { useReducer } from 'react';
import CanvasContext from './canvasContext';
import canvasReducer from './canvasReducer';
import {
  READ_FILE,
  WRITE_FILE,
  BUILD_CANVAS,
  BUILD_RECTANGLE,
  DRAW_LINE,
  FILE_ERROR
} from './types';

const CanvasState = props => {
  const initialState = {
    input: null,
    lines: null,
    error: null
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
              params.canvas = {
                width: rowArr[1],
                height: rowArr[2]
              };
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
    dispatch({ type: FILE_ERROR, payload: err });
  };

  //Draw border
  const drawLine = (elem, lines) => {
    let linesContent = [];
    const startX = elem.offsetLeft;
    const startY = elem.offsetTop;

    lines.forEach(line => {
      if (
        isNaN(line.start.x) ||
        isNaN(line.start.y) ||
        isNaN(line.end.x) ||
        isNaN(line.end.y)
      ) {
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
        return;
      }

      for (let i = start; i < end; i += 10) {
        if (vertical) {
          linesContent.push({
            content: 'x',
            left: `${line.start.x + startX - 10}px`,
            top: `${i}px`
          });
        } else {
          linesContent.push({
            content: 'x',
            left: `${i}px`,
            top: `${line.start.y + startY}px`
          });
        }
      }
    });
    dispatch({
      type: DRAW_LINE,
      payload: linesContent
    });
  };

  return (
    <CanvasContext.Provider
      value={{
        input: state.input,
        lines: state.lines,
        error: state.error,
        readFile,
        setError,
        drawLine
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  );
};

export default CanvasState;
