import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer=combineReducers({user:userReducer})

const persistConfig={
  key:'root',
  storage,
  version:1,
}
// persistConfig is sitting the name of the key in the local storage,the version and the storage

const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
        //   by using line we will not get an error for variables
  }),
})  

export const persistor=persistStore(store);
// this persistor is going to store persistedReducer
// redux persist :helps us to store the user data inside the local storage.