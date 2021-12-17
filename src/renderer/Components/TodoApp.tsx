import { useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/hooks';
import Input from './Input/Input';
import { SettingsModal } from './Modal/SettingsModal/SettingsModal';
import Navigation from './Navigation/Navigation';
import style from './TodoApp.module.scss';
import './UpdateNotification.css';

const TodoApp = () => {
  const theme = useAppSelector((state) => state.theme);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const show: { current: HTMLDivElement | null } = useRef(null);

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
      <div ref={show} id="notification" className="hidden">
        <p id="message" />
        <button
          type="button"
          id="close-button"
          onClick={() => {
            show.current?.classList.add('hidden');
          }}
        >
          Close
        </button>
        <button
          type="button"
          id="restart-button"
          onClick={() => {
            electron.updateApi.restartAndUpdate();
          }}
          className="hidden"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
