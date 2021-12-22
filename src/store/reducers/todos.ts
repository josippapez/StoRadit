import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const displaySuccess = () => {
  toast.success('🤙 Spremljeno!', {
    theme: 'colored',
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const displayDoneAdded = () => {
  toast.success('🙂 Riješeno!', {
    theme: 'colored',
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const displayError = () => {
  toast.error('Obrisano!', {
    theme: 'colored',
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const displayDoneRemoved = () => {
  toast.error('Nije riješeno!', {
    theme: 'colored',
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export interface TodoUpdate {
  id: number;
  name: string;
  text: string;
}

export interface Todo {
  id: number;
  name: string;
  date: string;
  text: string;
  scheduled?: string | null;
}
export interface TodoState {
  todos: null | Todo[];
  doneTodos: Todo[];
  selectedTodo: Todo | Partial<Todo> | null;
}

const initialState: TodoState = {
  todos: [],
  doneTodos: [],
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
      displaySuccess();
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      const todos = state.todos && [...state.todos];
      if (todos) {
        state.todos = todos?.concat(action.payload);
        displaySuccess();
      }
    },
    removeTodo: (state, action: PayloadAction<Todo>) => {
      const todos = state.todos && [...state.todos];
      const doneTodos = state.doneTodos && [...state.doneTodos];
      if (state.selectedTodo && action.payload.id === state.selectedTodo.id) {
        state.selectedTodo = null;
      }
      if (todos) {
        state.todos = todos?.filter((todo) => todo.id !== action.payload.id);
      }
      if (doneTodos) {
        state.doneTodos = doneTodos?.filter(
          (todo) => todo.id !== action.payload.id
        );
      }
      displayError();
    },
    setSelectedTodo: (
      state,
      action: PayloadAction<Todo | Partial<Todo> | null>
    ) => {
      state.selectedTodo = { ...action.payload };
    },
    setScheduling: (state, action: PayloadAction<string | null>) => {
      state.selectedTodo = {
        ...state.selectedTodo,
        scheduled: action.payload,
      };
      const todos = state.todos && [...state.todos];
      if (todos) {
        state.todos = todos?.map((todo) =>
          todo.id === state.selectedTodo?.id
            ? {
                ...todo,
                scheduled: action.payload,
              }
            : todo
        );
      }
      displaySuccess();
    },
    addDoneTodo: (state, action: PayloadAction<Todo>) => {
      const doneTodos = state.doneTodos && [...state.doneTodos];
      const oldTodoList = state.todos ? [...state.todos] : [];
      state.todos = [...oldTodoList]?.filter(
        (todo) => todo.id !== action.payload.id
      );
      if (doneTodos) {
        state.doneTodos = doneTodos?.concat(action.payload);
      }
      displayDoneAdded();
    },
    removeDoneTodo: (state, action: PayloadAction<Todo>) => {
      const doneTodos = state.doneTodos && [...state.doneTodos];
      const oldTodoList = state.todos ? [...state.todos] : [];
      state.todos = oldTodoList?.concat(action.payload);
      if (doneTodos) {
        state.doneTodos = [...doneTodos]?.filter(
          (todo) => todo.id !== action.payload.id
        );
      }
      displayDoneRemoved();
    },
  },
});

export const {
  addTodo,
  updateTodo,
  setSelectedTodo,
  removeTodo,
  addDoneTodo,
  removeDoneTodo,
  setScheduling,
} = todosSlice.actions;

export default todosSlice.reducer;
