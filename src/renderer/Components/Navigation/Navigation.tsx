import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { removeTodo, setSelectedTodo } from '../../../store/reducers/todos';
import style from './Navigation.module.scss';

interface Props {
  darkmode: boolean;
}
const Navigation = (props: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { darkmode } = props;
  const todos = useAppSelector((state) => state.todos.todos);
  return (
    <div className={style.navigation}>
      <button
        type="button"
        className={`${style.addNewButton} ${
          darkmode ? style.light : style.dark
        }`}
        key="addNewButton"
        aria-label="Add new button"
        onClick={() =>
          dispatch(
            setSelectedTodo({
              date: new Date().toLocaleDateString('hr'),
              name: `Novi zapis ${new Date().toLocaleDateString('hr')}`,
              text: ' ',
            })
          )
        }
      />
      {todos?.map((todo) => (
        <div className={style.item} key={todo.id}>
          <div
            aria-hidden="true"
            role="button"
            className={`${style.item} ${style.delete} ${
              darkmode ? style.light : style.dark
            }`}
            onClick={() => {
              dispatch(removeTodo(todo));
            }}
          />
          <button
            type="button"
            className={`${style.item} ${style.itemButton}`}
            onClick={() => {
              dispatch(setSelectedTodo(todo));
            }}
          >
            {todo.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Navigation;
