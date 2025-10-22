import React, { useState, useEffect } from 'react';
import { InformationCircleIcon } from './icons';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7AVkDKJj0pog1UCxuE84Vz8DiXQhEbyjVak2uyF6p6nm0y-9MN5bGnIS5cNgM77gOtBnd3atUkPlv/pub?output=csv';

const AnnouncementBanner: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Add a cache-busting parameter to prevent stale data
        const response = await fetch(`${SHEET_URL}&_=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch announcement: ${response.statusText}`);
        }
        const csvText = await response.text();
        const firstLine = csvText.split('\n')[0];
        
        // Basic CSV parsing for the first cell, handles if it's quoted.
        let cellA1 = firstLine.split(',')[0];
        if (cellA1.startsWith('"') && cellA1.endsWith('"')) {
            cellA1 = cellA1.substring(1, cellA1.length - 1).replace(/""/g, '"');
        }
        
        if (cellA1 && cellA1.trim()) {
            setMessage(cellA1.trim());
        } else {
            setMessage(null); // Don't show banner if cell is empty
        }

      } catch (e) {
        console.error('Error fetching announcement:', e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, []);

  if (isLoading || error || !message) {
    return null; // Don't render anything if loading, error, or no message
  }

  return (
    <div className="bg-sky-600 text-white shadow-md dark:bg-sky-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center p-3 text-center">
                <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                <p className="font-bold text-base">{message}</p>
            </div>
        </div>
    </div>
  );
};

export default AnnouncementBanner;
