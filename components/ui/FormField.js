import React from 'react';

export default function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
  options = [], // 用于select, radio和checkbox
  rows = 4, // 用于textarea
  hint = '', // 帮助文本
  min, // 用于number, date, range
  max, // 用于number, date, range
  step, // 用于number, range
}) {
  // 生成唯一ID
  const id = `field-${name}`;

  // 根据类型渲染不同输入
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`input-field ${error ? 'border-red-500' : ''}`}
          />
        );
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`input-field ${error ? 'border-red-500' : ''}`}
          >
            <option value="">{placeholder || '请选择'}</option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="flex flex-col space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  disabled={disabled}
                  className="w-4 h-4 text-primary"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        if (options.length > 0) {
          // 多选框组
          return (
            <div className="flex flex-col space-y-2">
              {options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={name}
                    value={option.value}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          );
        } else {
          // 单个多选框
          return (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                checked={value}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 text-primary rounded"
              />
              <span>{placeholder}</span>
            </label>
          );
        }
      default:
        return (
          <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={`input-field ${error ? 'border-red-500' : ''}`}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}