const initialState = {
  authenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_AUTH": {
      const authenticated = !state.authenticated;
      return {
        ...state,
        authenticated
      };
    }

    default:
      return state;
  }
};
