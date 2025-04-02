import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, text, danger
  size = 'md', // sm, md, lg
  disabled = false,
  fullWidth = false,
  className = '',
  icon = null,
  iconPosition = 'left', // left, right
  loading = false,
  ...props
}) {
  // 变体样式
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-200',
    text: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  // 尺寸样式
  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-5 text-base',
  };

  // 组合所有样式
  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  const renderSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && renderSpinner()}
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
}