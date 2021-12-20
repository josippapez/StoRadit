import { useCallback, useEffect, useRef, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Editor from 'rich-markdown-editor';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addTodo,
  setSelectedTodo,
  Todo,
  updateTodo,
} from '../../../store/reducers/todos';
import { color1, dark, light } from './EditorTheme';
import style from './Input.module.scss';

interface Props {
  theme: string;
}

const Input = (props: Props): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { theme } = props;
  const selectedTodo: Todo | Partial<Todo> | null = useAppSelector(
    (state) => state.todos.selectedTodo
  );

  const [saving, setSaving] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [todo, setTodo] = useState<Todo | Partial<Todo> | null>(null);

  const value: { current: undefined | string } = useRef();
  const dateTime: { current: string | undefined } = useRef(
    new Date().toLocaleString('hr-HR', {
      timeStyle: 'short',
      dateStyle: 'short',
    })
  );

  useEffect(() => {
    if (selectedTodo) {
      value.current = selectedTodo?.text;
      setTodo(selectedTodo);
    }
    if (!selectedTodo) {
      setTodo(null);
      value.current = ' ';
    }
  }, [selectedTodo]);

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
        dispatch(setSelectedTodo({ ...todo, text: value.current }));
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
    const saveListenerFunction = (event: {
      key: string;
      ctrlKey: boolean;
      preventDefault: () => void;
    }) => {
      const charCode = event.key.toLowerCase();
      if (event.ctrlKey && charCode === 's') {
        event.preventDefault();
        if (
          todo &&
          todo.name &&
          value.current &&
          JSON.stringify({ ...todo, text: value.current }) !==
            JSON.stringify(selectedTodo)
        ) {
          setSaving(true);
        }
      }
    };

    window.addEventListener('keydown', saveListenerFunction);
    return () => {
      setShowScheduling(false);
      window.removeEventListener('keydown', saveListenerFunction);
    };
  }, [selectedTodo, todo]);

  const setValue = (getValue: () => string) => {
    value.current = getValue();
  };

  return (
    selectedTodo && (
      <div className={style['markdown-input']} key={todo?.id}>
        <input
          id="nameInput"
          className={style['name-input']}
          type="text"
          defaultValue={todo?.name}
          onChange={(e) => {
            setTodo({ ...todo, text: value.current, name: e.target.value });
          }}
        />
        <div className={style.schedule}>
          {!showScheduling && selectedTodo.id && (
            <button
              type="button"
              className={style['schedule-button']}
              onClick={() => setShowScheduling(true)}
            >
              Dodaj rok završetka
            </button>
          )}
          {showScheduling && (
            <>
              <Datetime
                className={style['schedule-input']}
                locale="hr"
                initialValue={new Date()}
                onChange={(e) => {
                  dateTime.current = e.toString();
                }}
                dateFormat="DD.MM.yyyy."
                timeFormat="hh:mm"
              />
              <button
                className={style['schedule-button']}
                type="button"
                aria-label="hidden"
                onClick={() => {
                  if (dateTime.current) {
                    electron.scheduleAPI.schedule(
                      dateTime.current.toString(),
                      todo
                    );
                  }
                }}
              >
                Save
              </button>
            </>
          )}
        </div>
        {value.current && (
          <Editor
            // eslint-disable-next-line no-nested-ternary
            theme={theme === 'dark' ? dark : theme === 'light' ? light : color1}
            value={value.current}
            autoFocus
            onChange={setValue}
          />
        )}
      </div>
    )
  );
};

export default Input;
