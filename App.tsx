import React, { useState } from 'react';
import { DownloadItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import DownloadCard from './components/DownloadCard';
import SettingsModal from './components/SettingsModal';
import { SettingsIcon } from './components/icons';

const DEFAULT_ITEMS: DownloadItem[] = [
  {
    id: '1',
    title: 'Weekly Sales Report',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Sales Reports',
  },
  {
    id: '2',
    title: 'Monthly Sales Report',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Sales Reports',
  },
    {
    id: '3',
    title: 'Annual Sales Report',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Sales Reports',
  },
    {
    id: '4',
    title: 'Sales Dashboard',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Sales Reports',
  },
  {
    id: '5',
    title: 'Q3 Financial Summary',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Financial Reports',
  },
  {
    id: '6',
    title: 'Annual Financial Statement',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Financial Reports',
  },
  {
    id: '11',
    title: 'Investor Relations Deck',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Financial Reports',
  },
  {
    id: '12',
    title: 'Expense Breakdown',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Financial Reports',
  },
  {
    id: '7',
    title: 'Monthly User Engagement',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'User Metrics',
  },
  {
    id: '8',
    title: 'Daily Active Users',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'User Metrics',
  },
  {
    id: '13',
    title: 'User Retention Rate',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'User Metrics',
  },
  {
    id: '14',
    title: 'Churn Analysis',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'User Metrics',
  },
  {
    id: '9',
    title: 'Marketing Campaign Performance',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Marketing',
  },
  {
    id: '10',
    title: 'Social Media Reach',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Marketing',
  },
  {
    id: '15',
    title: 'SEO Keyword Rankings',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Marketing',
  },
  {
    id: '16',
    title: 'Email Campaign Open Rates',
    downloadUrl: '#',
    refreshUrl: '#',
    group: 'Marketing',
  },
];


const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [downloadItems, setDownloadItems] = useLocalStorage<DownloadItem[]>('downloadItems', DEFAULT_ITEMS);

  const groupedItems = React.useMemo(() => {
    return downloadItems.reduce((acc, item) => {
    const group = item.group || 'Uncategorized';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, DownloadItem[]>);
  }, [downloadItems]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Hire Helper</h1>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
              aria-label="Open settings"
            >
              <SettingsIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {downloadItems.length > 0 ? (
           <div className="space-y-12">
            {Object.entries(groupedItems).map(([groupName, items]) => (
              <section key={groupName}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{groupName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {items.map(item => (
                    <DownloadCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">No Download Links Configured</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Click the settings icon in the top right to add your first download link.
            </p>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
            >
              Configure Now
            </button>
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        items={downloadItems}
        onSave={setDownloadItems}
      />
    </div>
  );
};

export default App;