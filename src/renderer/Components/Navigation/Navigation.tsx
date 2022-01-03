import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addDoneTodo,
  removeDoneTodo,
  removeTodo,
  setSelectedTodo,
} from '../../../store/reducers/todos';
import style from './Navigation.module.scss';

interface Props {
  theme: string;
}
const Navigation = (props: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { theme } = props;
  const todos = useAppSelector((state) => state.todos);
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);

  return (
    <div className={style.navigation}>
      <div className={style.topTab}>
        <div className={style.menu}>
          <div
            aria-hidden="true"
            role="button"
            className={`${style.menuActive} ${
              selectedTab === 'active' ? style.active : ''
            }`}
            onClick={() => {
              setSelectedTab('active');
              setSearchText('');
              if (searchInputRef.current) {
                const target = searchInputRef.current as HTMLInputElement;
                target.value = '';
              }
            }}
          >
            Aktivno ({todos?.todos?.length})
          </div>
          <div
            aria-hidden="true"
            role="button"
            className={`${style.menuDone} ${
              selectedTab === 'done' ? style.active : ''
            }`}
            onClick={() => {
              setSelectedTab('done');
              setSearchText('');
              if (searchInputRef.current) {
                const target = searchInputRef.current as HTMLInputElement;
                target.value = '';
              }
            }}
          >
            Riješeno ({todos?.doneTodos?.length})
          </div>
        </div>
        <div className={style.search}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pretraživanje po nazivu i sadržaju"
            className={style.searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                setSearchText(target.value);
              }
            }}
          />
        </div>
        {selectedTab === 'active' && (
          <button
            type="button"
            className={`${style.addNewButton} ${
              theme === 'dark' || theme === 'color1' ? style.light : style.dark
            }`}
            key="addNewButton"
            aria-label="Add new button"
            onClick={() =>
              dispatch(
                setSelectedTodo({
                  date: new Date().toLocaleDateString('hr'),
                  name: `${new Date().toLocaleDateString(
                    'hr'
                  )} ${new Date().toLocaleTimeString('hr')}`,
                  text: '',
                })
              )
            }
          />
        )}
      </div>
      <div className={style.list}>
        {selectedTab === 'active' &&
          todos &&
          todos.todos &&
          (searchText
            ? todos.todos.filter(
                (todo) =>
                  todo.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  todo.text.toLowerCase().includes(searchText.toLowerCase())
              )
            : todos.todos
          ).map((todo) => (
            <div className={style.item} key={todo.id}>
              <div
                aria-hidden="true"
                role="button"
                className={`${style.item} ${style.delete} ${
                  theme === 'light' ? style.light : style.dark
                }`}
                onClick={() => {
                  dispatch(removeTodo(todo));
                }}
              />
              <div
                aria-hidden="true"
                role="button"
                className={`${style.item} ${style.markAsDone} ${
                  theme === 'light' ? style.light : style.dark
                }`}
                onClick={() => {
                  dispatch(addDoneTodo(todo));
                }}
              />
              <button
                type="button"
                className={`${style.item} ${style.itemButton} ${
                  todo.id === todos.selectedTodo?.id ? style.active : ''
                }`}
                onClick={() => {
                  dispatch(setSelectedTodo(todo));
                }}
              >
                {todo.name}
              </button>
            </div>
          ))}
        {selectedTab === 'done' &&
          todos &&
          todos.doneTodos &&
          (searchText
            ? todos.doneTodos.filter(
                (todo) =>
                  todo.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  todo.text.toLowerCase().includes(searchText.toLowerCase())
              )
            : todos.doneTodos
          ).map((todo) => (
            <div className={style.item} key={todo.id}>
              <div
                aria-hidden="true"
                role="button"
                className={`${style.item} ${style.delete} ${
                  theme === 'light' ? style.light : style.dark
                }`}
                onClick={() => {
                  dispatch(removeTodo(todo));
                }}
              />
              <div
                aria-hidden="true"
                role="button"
                className={`${style.item} ${style.markAsNotDone} ${
                  theme === 'light' ? style.light : style.dark
                }`}
                onClick={() => {
                  dispatch(removeDoneTodo(todo));
                }}
              />
              <button
                type="button"
                className={`${style.item} ${style.itemButton} ${
                  todo.id === todos.selectedTodo?.id ? style.active : ''
                }`}
                onClick={() => {
                  dispatch(setSelectedTodo(todo));
                }}
              >
                {todo.name}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Navigation;
