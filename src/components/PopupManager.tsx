import { useCallback } from 'react';
import CommonPopup from './CommonPopup';
import { usePopup } from '@context/PopupContext';

const PopupManager = () => {
  const { currentPopup, hidePopup } = usePopup();

  const handleConfirm = useCallback(() => {
    currentPopup?.onConfirm?.();
    hidePopup();
  }, [currentPopup, hidePopup]);

  const handleCancel = useCallback(() => {
    currentPopup?.onCancel?.();
    hidePopup();
  }, [currentPopup, hidePopup]);

  if (!currentPopup) {
    return null;
  }

  return (
    <CommonPopup
      visible={!!currentPopup}
      title={currentPopup.title}
      message={currentPopup.message}
      confirmText={currentPopup.confirmText}
      cancelText={currentPopup.cancelText}
      isDanger={currentPopup.isDanger}
      confirmButtonColor={currentPopup.confirmButtonColor}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

export default PopupManager;
