import * as ex from './actions';

//----------------------------------------------------------------------
const initialState = {
  isLoading: false,
  error: null,
  data: null,
  menu: ex.explore_menu
};

//----------------------------------------------------------------------
export default function reducer_Explore(state = initialState, action) {
  switch (action.type) {
    case ex.BEGIN:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case ex.TRACES:
    case ex.LOGS:
    case ex.RECEIPTS:
    case ex.TRANSACTIONS:
    case ex.BLOCKS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload
      };

    case ex.ACCOUNTS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload[0].caches[0].items
      };

    // EXISTING_CODE
    // EXISTING_CODE

    case ex.FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.err,
        data: null
      };

    default:
      return state;
  }
}