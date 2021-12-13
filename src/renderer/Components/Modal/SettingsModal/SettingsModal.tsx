import { useAppDispatch } from '../../../../store/hooks';
import { darkTheme, lightTheme } from '../../../../store/reducers/theme';
import Modal from '../Modal';
import style from './SettingsModal.module.scss';

interface Props {
  closeModal(): void;
  show: boolean;
}

export const SettingsModal = (props: Props) => {
  const { closeModal, show } = props;
  const dispatch = useAppDispatch();
  return (
    <Modal show={show} position="right" closeModal={closeModal}>
      <div className={style.settingsModal}>
        <div
          aria-hidden="true"
          role="button"
          className="header-close-icon"
          onClick={() => closeModal()}
        />
        <div className={style.title}>Postavke</div>
        <div className={style.settingsBody}>
          <div className={style.settingsTheme}>
            <div className={style.categoryTitle}>Tema</div>
            <div className={style.settingsThemeBackground}>
              <div>
                <button
                  className={`${style.settingsTheme} ${style.lightTheme}`}
                  aria-hidden="true"
                  type="button"
                  onClick={() => {
                    dispatch(lightTheme());
                  }}
                />
                <div className={style.mainText}>Svijetli način</div>
              </div>
              <div>
                <button
                  className={`${style.settingsTheme} ${style.darkTheme}`}
                  aria-hidden="true"
                  type="button"
                  onClick={() => {
                    dispatch(darkTheme());
                  }}
                />
                <div className={style.mainText}>Tamni način</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
