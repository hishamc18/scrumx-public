import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice'
import notesReducer from '../features/noteSlice'
import aiSlice from "../features/aiSlice"
import projectReducer from '../features/projectSlice'
import trelloPersonal from "../features/personalSlice"
import chatReducer from "../features/chatSlice"
import projectTrello from "../features/projectTrello"
import searchReducer from "../features/searchSlice"
import streamReducer from "../features/streamSlice"
const store = configureStore({
  reducer: {
    auth: authSlice,
    notes: notesReducer,
    aichat: aiSlice,
    project: projectReducer,
    trello: trelloPersonal,
    chat: chatReducer,
    projectTrello:projectTrello,
    search:searchReducer,
    stream:streamReducer
   
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;