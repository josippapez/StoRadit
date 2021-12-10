import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../store/reducers/theme';
import Input from './Input/Input';
import Navigation from './Navigation/Navigation';
import style from './TodoApp.module.scss';
import 'react-toastify/dist/ReactToastify.css';

const TodoApp = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  return (
    <div className={`App ${theme.theme ? 'darkmode' : 'lightmode'}`}>
      <div className={style['darkmode-switch']}>
        <input
          type="checkbox"
          className={style['darkmode-switch__input']}
          id="Switch"
          readOnly
          checked={!theme.theme}
          onClick={() => {
            dispatch(toggleTheme());
          }}
        />
        <label className={style['darkmode-switch__label']} htmlFor="Switch">
          <span className={style['darkmode-switch__indicator']} />
          <span className={style['darkmode-switch__decoration']} />
        </label>
      </div>
      <div className={style['todo-app']}>
        <Navigation darkmode={theme.theme} />
        <Input darkTheme={theme.theme} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default TodoApp;
