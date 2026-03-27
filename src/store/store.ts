import { configureStore } from '@reduxjs/toolkit'
import  WordSlice  from './WordSlice'

export const store = configureStore({
    reducer: {
        words : WordSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch