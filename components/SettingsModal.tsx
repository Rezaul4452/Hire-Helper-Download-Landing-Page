import React, { useState, useEffect } from 'react';
import { DownloadItem } from '../types';
import { PlusIcon, TrashIcon, CloseIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DownloadItem[];
  onSave: (items: DownloadItem[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, items, onSave }) => {
  const [editableItems, setEditableItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEditableItems(JSON.parse(JSON.stringify(items))); // Deep copy to avoid mutating props
    }
  }, [isOpen, items]);

  if (!isOpen) {
    return null;
  }

  const handleItemChange = (id: string, field: keyof Omit<DownloadItem, 'id'>, value: string) => {
    setEditableItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    setEditableItems(prevItems => [
      ...prevItems,
      {
        id: new Date().getTime().toString(),
        title: 'New Download Item',
        downloadUrl: '#',
        refreshUrl: '#',
        group: '',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setEditableItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave(editableItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {editableItems.map((item, index) => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium text-slate-600 dark:text-slate-300">Item #{index + 1}</p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                  aria-label={`Remove item ${item.title}`}
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`title-${item.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id={`title-${item.id}`}
                    value={item.title}
                    onChange={e => handleItemChange(item.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
                 <div>
                  <label htmlFor={`group-${item.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Group Header
                  </label>
                  <input
                    type="text"
                    id={`group-${item.id}`}
                    placeholder="e.g., Sales Reports"
                    value={item.group || ''}
                    onChange={e => handleItemChange(item.id, 'group', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`downloadUrl-${item.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Download Excel URL
                  </label>
                  <input
                    type="url"
                    id={`downloadUrl-${item.id}`}
                    value={item.downloadUrl}
                    onChange={e => handleItemChange(item.id, 'downloadUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`refreshUrl-${item.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Refresh Data URL
                  </label>
                  <input
                    type="url"
                    id={`refreshUrl-${item.id}`}
                    value={item.refreshUrl}
                    onChange={e => handleItemChange(item.id, 'refreshUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="w-full flex items-center justify-center py-2 px-4 border border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <PlusIcon />
            <span className="ml-2">Add New Item</span>
          </button>
        </div>

        <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mr-3">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;