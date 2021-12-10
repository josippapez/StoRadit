import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  theme: boolean;
}

const initialState: ThemeState = {
  theme: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = !state.theme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
