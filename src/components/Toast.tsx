import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheck, MdClose, MdInfo, MdError, MdWarning } from 'react-icons/md';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

// Sound notification function
const playNotificationSound = (type: ToastType) => {
  try {
    const audio = new Audio();
    
    switch (type) {
      case 'success':
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3';
        break;
      case 'error':
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3';
        break;
      case 'warning':
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3';
        break;
      default:
        audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-remove-2576.mp3';
    }
    
    audio.volume = 0.5;
    audio.play();
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

export const Toast = ({ message, type = 'info', duration = 5000, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(true);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Play sound when toast appears
    playNotificationSound(type);
    
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, type]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheck className="w-5 h-5" />;
      case 'error':
        return <MdError className="w-5 h-5" />;
      case 'warning':
        return <MdWarning className="w-5 h-5" />;
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
          ref={toastRef}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`alert ${getAlertClass()} shadow-lg max-w-md w-full`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span className="text-sm font-medium">{message}</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="btn btn-ghost btn-xs"
              aria-label="Close notification"
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
    <div className="toast toast-top toast-end z-50 p-4 gap-3 max-w-md">
      {children}
    </div>
  );
}; 