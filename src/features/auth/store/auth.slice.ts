
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type User = {
    name: string,
    email?: string,
    role?: string,
    id?: string,
    profileImage?: string
}

export type authIntialState ={
    isAuthinticated: boolean,
    userInfo: null | User
}

const initialState:authIntialState ={
    isAuthinticated: false,
    userInfo: null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setAuthInfo: function (state , action:PayloadAction<authIntialState>){
            state.isAuthinticated = action.payload.isAuthinticated
            state.userInfo = action.payload.userInfo
        },

        logout: function(state){
            state.isAuthinticated = false
            state.userInfo = null
        }
    }
})

export const authSliceReducer = authSlice.reducer

export const { setAuthInfo, logout } = authSlice.actions

