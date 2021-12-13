import PropTypes from 'prop-types';
import style from './Modal.module.scss';

interface Props {
  closeModal(): void;
  position?: 'center' | 'left' | 'right';
  children: JSX.Element;
  show: boolean;
}

const Modal = (props: Props): JSX.Element => {
  const { closeModal, position, children, show } = props;
  return (
    <div
      style={{ display: !show ? 'none' : 'unset' }}
      aria-hidden="true"
      role="button"
      className={`${style.overlay}`}
      onMouseDown={() => closeModal()}
    >
      <div
        aria-hidden="true"
        role="button"
        className={`${style.children} ${style[`${position}`]}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.defaultProps = {
  position: 'center',
  closeModal: () => {},
};

Modal.propTypes = {
  closeModal: PropTypes.func,
  position: PropTypes.string,
  children: PropTypes.shape({}).isRequired,
};

export default Modal;
