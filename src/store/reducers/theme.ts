import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  theme: string;
}

const initialState: ThemeState = {
  theme: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    darkTheme: (state) => {
      state.theme = 'dark';
    },
    lightTheme: (state) => {
      state.theme = 'light';
    },
  },
});

export const { darkTheme, lightTheme } = themeSlice.actions;

export default themeSlice.reducer;
