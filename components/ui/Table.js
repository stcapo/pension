import { useState } from 'react';

export default function Table({ 
  columns, 
  data, 
  onRowClick,
  pagination = true,
  pageSize = 10,
  emptyMessage = '暂无数据',
  className = ''
}) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // 计算总页数
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1;
  
  // 分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = pagination ? data.slice(startIndex, endIndex) : data;
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            显示 <span className="font-medium">{startIndex + 1}</span> 到{' '}
            <span className="font-medium">{endIndex}</span> 共{' '}
            <span className="font-medium">{data.length}</span> 条记录
          </p>
        </div>
        
        <div className="flex justify-end">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md mr-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 mx-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md ml-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </nav>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {column.render ? column.render(row) : row[column.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
}