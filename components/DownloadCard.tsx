import React, { useState } from 'react';
import { DownloadItem } from '../types';
// Fix: Import PlusIcon for the 'Add' button on suggestion cards.
import { DownloadIcon, RefreshIcon, SpinnerIcon, ClockIcon, PlusIcon } from './icons';

interface DownloadCardProps {
  item: DownloadItem;
  onRefresh: (itemId: string) => void;
  // Fix: Add an optional 'onAdd' prop to handle adding AI suggestions.
  onAdd?: (item: DownloadItem) => void;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ item, onRefresh, onAdd }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Fix: Determine if the card is a suggestion card based on the presence of 'onAdd'.
  const isSuggestion = !!onAdd;

  const handleRefresh = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isRefreshing) return;

    setIsRefreshing(true);

    if (item.refreshUrl && item.refreshUrl !== '#') {
      window.open(item.refreshUrl, '_blank', 'noopener,noreferrer');
    }
    
    onRefresh(item.id);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // Fix: Add a handler for the 'Add' action on suggestion cards.
  const handleAdd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if(onAdd) {
        onAdd(item);
    }
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white" title={item.title}>
          {item.title}
        </h3>
        {/* Fix: Conditionally render timestamp or suggestion tag. */}
        {isSuggestion ? (
            <div className="mt-2" aria-label="AI Suggestion">
                <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI Suggestion</span>
            </div>
        ) : (
            <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400" aria-label={`Last refreshed: ${formatTimestamp(item.lastRefreshed)}`}>
                <ClockIcon />
                <span className="ml-1.5">Last Refreshed: {formatTimestamp(item.lastRefreshed)}</span>
            </div>
        )}
      </div>
      {/* Fix: Conditionally render an 'Add' button for suggestions, or download/refresh buttons for regular items. */}
      {isSuggestion ? (
        <div className="p-6 pt-0 mt-auto">
          <a
            href="#"
            onClick={handleAdd}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Add to My List</span>
          </a>
        </div>
      ) : (
        <div className="p-6 pt-0 mt-auto">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
              onClick={handleRefresh}
              rel="noopener noreferrer"
              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
                isRefreshing
                  ? 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-blue-500'
              }`}
              aria-disabled={isRefreshing}
              aria-live="polite"
            >
              {isRefreshing ? <SpinnerIcon /> : <RefreshIcon />}
              <span className="ml-2">{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadCard;
