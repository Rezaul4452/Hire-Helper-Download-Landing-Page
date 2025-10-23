import React, { useState, useEffect } from 'react';
import { LockIcon, CloseIcon } from './icons';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string | null;
  title?: string;
  description?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, error, title, description }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset password after a short delay to allow closing animation
      setTimeout(() => setPassword(''), 300);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if(error) {
        setPassword('');
    }
  }, [error]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-sm w-full">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title || 'Enter Password'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {description || 'Please enter the password to access settings.'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="password-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm sm:text-sm 
                  ${error 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500'}
                  bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200
                `}
                autoFocus
                aria-describedby={error ? "password-error" : undefined}
                aria-invalid={!!error}
              />
            </div>
            {error && (
              <p id="password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mr-3">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
