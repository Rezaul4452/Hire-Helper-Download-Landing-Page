import React from 'react';
import { DownloadItem } from '../types';
import { DownloadIcon, RefreshIcon } from './icons';

interface DownloadCardProps {
  item: DownloadItem;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={item.title}>
          {item.title}
        </h3>
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
          >
            <DownloadIcon />
            <span className="ml-2">Download Excel</span>
          </a>
          <a
            href={item.refreshUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
          >
            <RefreshIcon />
            <span className="ml-2">Refresh Data</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;