const Utils = require('../../utils');

//----------------------------------------------------------------------
const BEGIN = 'support/BEGIN';
const SUCCESS = 'support/SUCCESS';
const FAILURE = 'support/FAILURE';

//----------------------------------------------------------------------
const initialState = {
  isLoading: false,
  error: null
};

//----------------------------------------------------------------------
export default function reducer_Support(state = initialState, action) {
  switch (action.type) {
    case BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      };

    case FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.err
      };

    default:
      return state;
  }
};

//----------------------------------------------------------------------
export const dispatcher_Support = () => {
  return (dispatch, getState) => {
    dispatch({
      type: BEGIN
    });

    return Utils.queryAPI_get('ping', '')
      .then(async (result) => {
        let json = await result.json();
        dispatch({
          type: SUCCESS,
          payload: json
        });
        return json;
      })
      .catch((err) => {
        dispatch({
          type: FAILURE,
          err
        });
      });
  };
};