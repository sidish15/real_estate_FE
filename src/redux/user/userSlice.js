import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
        currentUser: null,
        error: null,
        loading: false,
};

const userSlice = createSlice({
        name: 'user',
        initialState,
        reducers: {
                signInStart: (state) => {
                        state.loading = true;
                },
                signInSuccess: (state, action) => {
                        // action is the datan we get when we receive the data from the databse 
                        state.currentUser = action.payload;
                        state.loading = false;
                        state.error = null;
                },
                signInfailure: (state, action) => {
                        state.error = action.payload;
                        state.loading = false;

                },
                updateUserStart: (state) => {
                        state.loading = true;
                },
                updateUserSuccess: (state, action) => {
                        state.currentUser = action.payload;
                        state.loading = false;
                        state.error = null;
                },
                updateUserFailure: (state, action) => {
                        state.error = action.payload;
                        state.loading = false;

                },
                deleteUserStart: (state) => {
                        state.loading = true;
                },
                deleteUserSuccess: (state, action) => {
                        state.currentUser = null;
                        state.loading = false;
                        state.error = null;

                },
                deleteUserFailure: (state, action) => {
                        state.error = action.payload;
                        state.loading = false;

                },
                signOutUserStart: (state) => {
                        state.loading = true;
                },
                signOutUserSuccess: (state, action) => {
                        state.currentUser = null;
                        state.loading = false;
                        state.error = null;

                },
                signOutUserFailure: (state, action) => {
                        state.error = action.payload;
                        state.loading = false;

                }

        }
})
export const { signInStart,
        signInSuccess,
        signInfailure,
        updateUserFailure,
        updateUserStart,
        updateUserSuccess,
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailure,
        signOutUserStart,
        signOutUserSuccess,
        signOutUserFailure } = userSlice.actions;
export default userSlice.reducer;