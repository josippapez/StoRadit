import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from 'rich-markdown-editor';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addTodo,
  setSelectedTodo,
  Todo,
  updateTodo,
} from '../../../store/reducers/todos';
import { theme } from './EditorTheme';
import style from './Input.module.scss';

interface Props {
  darkTheme: boolean;
}

const Input = (props: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { darkTheme } = props;
  const selectedTodo: Todo | Partial<Todo> | null = useAppSelector(
    (state) => state.todos.selectedTodo
  );

  const [saving, setSaving] = useState(false);
  const [todo, setTodo] = useState<Todo | Partial<Todo> | null>(null);

  const value: { current: undefined | string } = useRef();

  useEffect(() => {
    const element: any = document.querySelectorAll('.ProseMirror > p');
    if (element && element.length) {
      element[element.length - 1].focus();
    }
    if (selectedTodo?.id !== todo?.id) {
      value.current = selectedTodo?.text;
      setTodo(selectedTodo);
    }
    if (!selectedTodo) {
      value.current = ' ';
    }
  }, [selectedTodo, todo]);

  const saveTodo = useCallback(() => {
    if (todo) {
      if (todo.id) {
        dispatch(
          updateTodo({
            id: todo.id,
            name: todo.name,
            text: value.current,
          })
        );
        dispatch(setSelectedTodo(todo));
      } else {
        const newTodo: Todo = {
          date: new Date().toLocaleDateString('hr'),
          name: todo?.name ? todo.name : '',
          text: value.current || '',
          id: crypto.getRandomValues(new Uint32Array(1))[0],
        };
        dispatch(addTodo(newTodo));
        dispatch(setSelectedTodo(newTodo));
      }
    }
  }, [dispatch, todo]);

  useEffect(() => {
    if (saving) {
      setSaving(false);
      saveTodo();
    }
  }, [saveTodo, saving]);

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      const charCode = event.key.toLowerCase();
      if (event.ctrlKey && charCode === 's') {
        event.preventDefault();
        setSaving(true);
      }
    });
    return () => {
      window.removeEventListener('keydown', (event) => {
        const charCode = event.key.toLowerCase();
        if (event.ctrlKey && charCode === 's') {
          event.preventDefault();
          setSaving(true);
        }
      });
    };
  }, []);

  const setValue = (getValue: () => string) => {
    value.current = getValue();
  };

  return (
    <div className={style['markdown-input']}>
      <input
        className={style['name-input']}
        type="text"
        defaultValue={todo?.name}
        onChange={(e) => {
          setTodo({ ...todo, name: e.target.value });
        }}
      />
      {darkTheme ? (
        <Editor dark value={value.current} autoFocus onChange={setValue} />
      ) : (
        <Editor
          theme={theme}
          value={value.current}
          autoFocus
          onChange={setValue}
        />
      )}
    </div>
  );
};

export default Input;
