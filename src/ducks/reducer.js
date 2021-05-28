const initialState = {
  username: '',
  profilePic: '',
};

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT';

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    payload: user,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case `${UPDATE_USER}`:
      return {
        ...state,
        username: payload.username,
        profilePic: payload.profilePic,
      };
    case `${LOGOUT}`:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
