import React, { createContext, useContext, useCallback, useState } from 'react';

export interface PopupOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  confirmButtonColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface PopupContextType {
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
  currentPopup: PopupOptions | null;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPopup, setCurrentPopup] = useState<PopupOptions | null>(null);

  const showPopup = useCallback((options: PopupOptions) => {
    setCurrentPopup(options);
  }, []);

  const hidePopup = useCallback(() => {
    setCurrentPopup(null);
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, currentPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider');
  }
  return context;
};
