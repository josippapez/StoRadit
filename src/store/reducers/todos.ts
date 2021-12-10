import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TodoUpdate {
  id: number;
  name: string;
  text: string;
}

export interface NewTodo {
  id?: number | null;
  name: string;
  date: string;
  text?: string;
}

export interface Todo {
  id: number;
  name: string;
  date: string;
  text: string;
}
export interface TodoState {
  todos: null | Todo[];
  selectedTodo: Todo | Partial<Todo> | null;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    updateTodo: (state, action: PayloadAction<Partial<Todo>>) => {
      state.todos = state.todos
        ? [...state.todos].map((todo) =>
            todo.id === action.payload.id
              ? {
                  ...todo,
                  ...action.payload,
                  date: new Date().toLocaleDateString('hr'),
                }
              : todo
          )
        : null;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      const todos = state.todos && [...state.todos];
      if (todos) {
        state.todos = todos?.concat(action.payload);
      }
    },
    removeTodo: (state, action: PayloadAction<Todo>) => {
      const todos = state.todos && [...state.todos];
      if (state.selectedTodo && action.payload.id === state.selectedTodo.id) {
        state.selectedTodo = null;
      }
      if (todos) {
        state.todos = todos?.filter((todo) => todo.id !== action.payload.id);
      }
    },
    setSelectedTodo: (
      state,
      action: PayloadAction<Todo | Partial<Todo> | null>
    ) => {
      state.selectedTodo = { ...action.payload };
    },
  },
});

export const { addTodo, updateTodo, setSelectedTodo, removeTodo } =
  todosSlice.actions;

export default todosSlice.reducer;
