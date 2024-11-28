import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    data: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state : any, action : any) => {
            state.status = true;
            state.data = action.payload;
        },
        removeUser: (state : any) => {
            state.status = false;
            state.data = null;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;