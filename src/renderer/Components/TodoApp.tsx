import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/hooks';
import Input from './Input/Input';
import { SettingsModal } from './Modal/SettingsModal/SettingsModal';
import Navigation from './Navigation/Navigation';
import style from './TodoApp.module.scss';

const TodoApp = () => {
  const theme = useAppSelector((state) => state.theme);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  electron.scheduleAPI.schedule();

  return (
    <div
      id="App"
      className={`App ${
        // eslint-disable-next-line no-nested-ternary
        theme.theme === 'dark'
          ? 'darkmode'
          : theme.theme === 'light'
          ? 'lightmode'
          : 'color1'
      }`}
    >
      <button
        aria-hidden="true"
        type="button"
        className={`${style.settingsButton} ${
          theme.theme === 'dark' ? style.dark : style.light
        }`}
        onClick={() => {
          setShowSettingsModal(true);
        }}
      />
      <div className={style['todo-app']}>
        <Navigation theme={theme.theme} />
        <Input theme={theme.theme} />
        <SettingsModal
          show={showSettingsModal}
          closeModal={() => {
            setShowSettingsModal(false);
          }}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default TodoApp;
