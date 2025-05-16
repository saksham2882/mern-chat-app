import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',

    initialState: {
        socket: null,
    },
    
    reducers: {
        setSocketId: (state, action) => {
            state.socket = action.payload;
        },
    },
});

export const { setSocketId } = socketSlice.actions;
export default socketSlice.reducer;