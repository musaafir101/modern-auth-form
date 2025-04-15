import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-50 text-green-800"
            : "bg-red-50 text-red-800"
        }`}
        role="alert"
      >
        <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg">
          {type === "success" ? (
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <FiAlertCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
