import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from "./slices/User.slices.ts"

const store = configureStore({
    reducer:{
        user: userSliceReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export default store; 