import {
  READ_FILE,
  WRITE_FILE,
  BUILD_CANVAS,
  DRAW_LINE,
  BUILD_RECTANGLE,
  BUILD_BUCKET,
  FILE_ERROR
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
        lines: action.payload
      };
    case FILE_ERROR:
      return {
        ...state,
        error: action.payload,
        input: null
      };
    default:
      return state;
  }
};
