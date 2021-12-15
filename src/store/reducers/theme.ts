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
    color1: (state) => {
      state.theme = 'color1';
    },
  },
});

export const { darkTheme, lightTheme, color1 } = themeSlice.actions;

export default themeSlice.reducer;
