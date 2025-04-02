import { useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg, xl, full
  closeOnOverlayClick = true,
  className = '',
}) {
  const modalRef = useRef(null);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // 点击overlay关闭
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOverlayClick) {
      onClose();
    }
  };

  // 如果modal未打开，不渲染
  if (!isOpen) return null;

  // 根据size设置宽度
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]} ${className}`}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* 页脚按钮区域 */}
        {footer && (
          <div className="px-4 py-3 border-t bg-gray-50 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}