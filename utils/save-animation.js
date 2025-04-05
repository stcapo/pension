// 保存按钮动画工具函数

// 简化的保存成功动画逻辑
export const useSaveAnimation = (setIsSaving, setSaveSuccess, closeModal) => {
  // 执行保存动作
  const handleSave = () => {
    setIsSaving(true);
    
    // 模拟保存过程
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // 显示成功消息后自动关闭模态框
      setTimeout(() => {
        setSaveSuccess(false);
        closeModal();
      }, 1500);
    }, 800);
  };

  return handleSave;
};

// 保存按钮的渲染逻辑
export const renderSaveButton = (isSaving, saveSuccess) => {
  if (isSaving) {
    return (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        保存中...
      </span>
    );
  } else if (saveSuccess) {
    return (
      <span className="flex items-center">
        <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        保存成功
      </span>
    );
  } else {
    return '保存';
  }
};

// 渲染成功消息覆盖层
export const renderSuccessOverlay = (saveSuccess) => {
  if (!saveSuccess) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="bg-green-200 rounded-full p-2">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-green-800">保存成功！</h3>
          </div>
        </div>
      </div>
    </div>
  );
};