import React from 'react';
import { AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineWarning, AiOutlineClose } from 'react-icons/ai';

export default function Alert({
  type = 'info', // info, success, warning, error
  title,
  message,
  closable = false,
  onClose,
  className = '',
}) {
  // 样式映射
  const typeStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: <AiOutlineInfoCircle size={20} className="text-blue-400" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: <AiOutlineCheckCircle size={20} className="text-green-400" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: <AiOutlineWarning size={20} className="text-yellow-400" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: <AiOutlineWarning size={20} className="text-red-400" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} p-4 rounded-md border-l-4 ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="text-sm mt-1">{message}</div>}
        </div>
        
        {closable && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none"
              onClick={onClose}
            >
              <AiOutlineClose size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}