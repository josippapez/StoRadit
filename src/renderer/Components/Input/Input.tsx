import AdapterLuxon from '@mui/lab/AdapterLuxon';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-datetime/css/react-datetime.css';
import Editor from 'rich-markdown-editor';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addTodo,
  setScheduling,
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

  const [showScheduling, setShowScheduling] = useState(false);
  const [todo, setTodo] = useState<Todo | Partial<Todo> | null>(null);

  const value: { current: undefined | string } = useRef();
  const [dateTime, setDateTime] = useState<DateTime | null>(DateTime.now());

  useEffect(() => {
    if (selectedTodo) {
      if (
        selectedTodo.scheduled &&
        DateTime.fromISO(selectedTodo.scheduled) < DateTime.now()
      ) {
        dispatch(setScheduling(null));
      }
      if (!todo || (todo && todo.id !== selectedTodo.id)) {
        setTodo(selectedTodo);
        value.current = selectedTodo?.text;
      }
    }
    if (!selectedTodo) {
      setTodo(null);
      value.current = '';
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
      } else {
        const newTodo: Todo = {
          date: new Date().toLocaleDateString('hr'),
          name: todo?.name ? todo.name : '',
          text: value.current || '',
          id: crypto.getRandomValues(new Uint32Array(1))[0],
        };
        dispatch(addTodo(newTodo));
      }
    }
  }, [dispatch, todo]);

  const saveListenerFunction = useCallback(
    (event: { key: string; ctrlKey: boolean; preventDefault: () => void }) => {
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
          saveTodo();
        }
      }
    },
    [todo]
  );

  useEffect(() => {
    window.addEventListener('keydown', saveListenerFunction);
    return () => {
      setShowScheduling(false);
      window.removeEventListener('keydown', saveListenerFunction);
    };
  }, [saveListenerFunction]);

  const setValue = (getValue: () => string) => {
    value.current = getValue();
  };

  return (
    selectedTodo && (
      <div className={style['markdown-input']} key={value.current}>
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
          {!showScheduling && selectedTodo.id && !selectedTodo.scheduled && (
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
              <ThemeProvider
                theme={createTheme(
                  createTheme({
                    palette: {
                      primary: {
                        main: '#00b0ff',
                      },
                      text: {
                        primary: 'var(--main-text)',
                      },
                      divider: '#fff',
                    },
                  }),
                  {
                    components: {
                      MuiSvgIcon: {
                        styleOverrides: {
                          root: {
                            fill: 'var(--main-text)',
                          },
                        },
                      },
                      MuiTextField: {
                        styleOverrides: {
                          root: {
                            backgroundColor: 'var(--input-background)',
                            borderRadius: '4px',
                            border: '1px solid transparent',
                            '&:hover': {
                              border: '1px solid #00b0ff',
                            },
                          },
                        },
                      },
                      MuiOutlinedInput: {
                        styleOverrides: {
                          notchedOutline: {
                            borderColor: 'transparent',
                          },
                        },
                      },
                    },
                  }
                )}
              >
                <LocalizationProvider locale="hr" dateAdapter={AdapterLuxon}>
                  <DateTimePicker
                    renderInput={(params: JSX.IntrinsicAttributes) => (
                      <TextField {...params} />
                    )}
                    views={[
                      'year',
                      'month',
                      'day',
                      'hours',
                      'minutes',
                      'seconds',
                    ]}
                    autoFocus
                    inputFormat="dd.MM.yyyy HH:mm:ss"
                    ampm={false}
                    ampmInClock={false}
                    value={dateTime}
                    onChange={(newValue) => {
                      setDateTime(newValue);
                    }}
                    minDate={DateTime.now()}
                  />
                </LocalizationProvider>
              </ThemeProvider>
              <button
                className={style['schedule-button']}
                type="button"
                aria-label="hidden"
                onClick={() => {
                  if (dateTime) {
                    dispatch(setScheduling(dateTime.toString()));
                    electron.scheduleAPI.schedule(dateTime.toString(), todo);
                    setShowScheduling(false);
                  }
                }}
              >
                Save
              </button>
            </>
          )}
        </div>
        <Editor
          defaultValue={value.current}
          // eslint-disable-next-line no-nested-ternary
          theme={theme === 'dark' ? dark : theme === 'light' ? light : color1}
          value={value.current}
          autoFocus
          onChange={setValue}
        />
      </div>
    )
  );
};

export default Input;
