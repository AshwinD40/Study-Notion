import { createSlice } from "@reduxjs/toolkit";
import { getStoredToken } from "../../../utils/storage";

const initialState = {
  signupData: null,
  loading: false,

  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,

  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setToken(state, action) {
      state.token = action.payload;
    },

    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
