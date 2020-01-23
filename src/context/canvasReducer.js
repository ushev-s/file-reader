import {
  READ_FILE,
  DRAW_BUCKET,
  DRAW_LINE,
  DRAW_RECTANGLE,
  OUTPUT_ERROR,
  FILE_ERROR,
  CLEAR_ERROR,
  CLEAR_OUTPUT
} from './types';

export default (state, action) => {
  switch (action.type) {
    case READ_FILE:
      return {
        ...state,
        input: action.payload,
        error: null
      };
    case DRAW_LINE:
      return {
        ...state,
        output: { ...state.output, lines: action.payload }
      };
    case DRAW_RECTANGLE:
      return {
        ...state,
        output: { ...state.output, rectangles: action.payload }
      };
    case DRAW_BUCKET:
      return {
        ...state,
        output: { ...state.output, buckets: action.payload }
      };
    case FILE_ERROR:
      return {
        ...state,
        error: action.payload,
        input: null
      };
    case OUTPUT_ERROR:
      return {
        ...state,
        outputError: [...state.outputError, action.payload]
      };
    case CLEAR_ERROR:
      return {
        ...state,
        outputError: []
      };
    case CLEAR_OUTPUT:
      return {
        ...state,
        output: {}
      };
    default:
      return state;
  }
};
