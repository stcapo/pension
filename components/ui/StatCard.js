import React from 'react';
import Link from 'next/link';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  isPositive = true, 
  linkTo, 
  linkText = '查看详情',
  color = 'blue' // blue, green, yellow, red, purple
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-gray-400 text-xs ml-2">较上月</span>
            </div>
          )}
        </div>
        
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      {linkTo && (
        <div className="mt-4 pt-3 border-t">
          <Link href={linkTo}>
            <div className="text-sm text-primary hover:underline">{linkText}</div>
          </Link>
        </div>
      )}
    </div>
  );
}