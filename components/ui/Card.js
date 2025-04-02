import React from 'react';

export default function Card({ 
  children, 
  title, 
  icon, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footer = null,
  footerClassName = '',
  onClick = null
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className={`px-4 py-3 border-b flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <h3 className="font-medium text-gray-800">{title}</h3>
          </div>
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}