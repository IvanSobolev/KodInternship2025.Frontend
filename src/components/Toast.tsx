import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheck, MdClose, MdInfo, MdError } from 'react-icons/md';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ message, type = 'info', duration = 5000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheck className="w-5 h-5" />;
      case 'error':
        return <MdError className="w-5 h-5" />;
      case 'warning':
        return <MdInfo className="w-5 h-5" />;
      default:
        return <MdInfo className="w-5 h-5" />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`alert ${getAlertClass()} shadow-lg max-w-sm w-full`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span className="text-sm">{message}</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="btn btn-ghost btn-xs"
            >
              <MdClose />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export interface ToastContainer {
  children: React.ReactNode;
}

export const ToastContainer = ({ children }: ToastContainer) => {
  return (
    <div className="toast toast-top toast-end z-50 p-4 gap-2">
      {children}
    </div>
  );
}; 