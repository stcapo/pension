import React, { useState } from 'react';

export default function Tabs({ 
  tabs = [], // { key, label, content, icon }数组
  defaultActiveKey,
  onChange,
  type = 'line', // line, card, segment
  size = 'md', // sm, md, lg
  className = '',
}) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || (tabs.length > 0 ? tabs[0].key : null));

  const handleTabChange = (key) => {
    setActiveKey(key);
    if (onChange) {
      onChange(key);
    }
  };

  // 类型样式
  const typeStyles = {
    line: {
      container: 'border-b border-gray-200',
      tab: 'py-2 px-4 border-b-2 -mb-px',
      activeTab: 'border-primary text-primary',
      inactiveTab: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    card: {
      container: 'border-b border-gray-200',
      tab: 'py-2 px-4 rounded-t-lg',
      activeTab: 'bg-white border border-gray-200 border-b-white text-primary',
      inactiveTab: 'bg-gray-50 text-gray-500 hover:text-gray-700',
    },
    segment: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'py-2 px-4 rounded-md',
      activeTab: 'bg-white shadow text-primary',
      inactiveTab: 'text-gray-500 hover:text-gray-700',
    },
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const style = typeStyles[type];

  return (
    <div className={className}>
      <div className={`flex ${style.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`
              ${style.tab} 
              ${activeKey === tab.key ? style.activeTab : style.inactiveTab}
              ${sizeStyles[size]}
              transition-colors font-medium
            `}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`${activeKey === tab.key ? 'block' : 'hidden'}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}