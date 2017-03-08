import {
  LOADING, GRANT_AUTHORITY, SET_TYPE, OPEN_EDITOR, CLOSE_EDITOR, TOGGLE_SEARCH, SET_DAY,
  OPEN_BATCH_EDITOR, CLOSE_BATCH_EDITOR,
} from './constants'

import {
  getUser, getAuth,
} from '../api/security'

import moment from 'moment'

const initialState = {
  user: getUser(),
  loading: false,
  authenticated: !!getAuth(),
  currentType: 'note',
  editor: {
    hidden: true,
    note: {},
  },
  searching: false,
  planner: {
    day: moment.now(),
  },
  batchEditor: {
    hidden: true,
  },
}

const Store = (state = initialState, action) => {
  console.log(action)
  switch(action.type) {
    case GRANT_AUTHORITY: return {
      ...state,
      authenticated: action.data.authenticated,
      user: action.data.username,
    }
    case LOADING: return {
      ...state,
      loading: action.data,
    }
    case SET_TYPE: return {
      ...state,
      currentType: action.data,
    }
    case OPEN_EDITOR: return {
      ...state,
      searching: false,
      editor: {
        hidden: false,
        note: action.data,
      },
    }
    case CLOSE_EDITOR: return {
      ...state,
      editor: {
        hidden: true,
        note: {},
      },
    }
    case OPEN_BATCH_EDITOR: return {
      ...state,
      batchEditor: {
        hidden: false,
        type: action.data,
      },
    }
    case CLOSE_BATCH_EDITOR: return {
      ...state,
      batchEditor: {
        hidden: true,
        type: '',
      },
    }
    case TOGGLE_SEARCH: return {
      ...state,
      searching: action.data,
    }
    case SET_DAY: return {
      ...state,
      planner: {
        ...state.planner,
        day: moment(action.data[0]),
      },
    }
    default: return initialState
  }
}

export default Store
