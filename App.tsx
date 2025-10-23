

import React, { useState } from 'react';
// Correct: Import from @google/genai.
import { GoogleGenAI, Type } from '@google/genai';
import { DownloadItem } from './types';
import { useFirestore } from './hooks/useFirestore';
import DownloadCard from './components/DownloadCard';
import SettingsModal from './components/SettingsModal';
import PasswordModal from './components/PasswordModal';
// Fix: Import SpinnerIcon to show a loading state when generating AI suggestions.
// Add SwitchHorizontalIcon for page navigation.
import { SettingsIcon, SearchIcon, SpinnerIcon, SwitchHorizontalIcon } from './components/icons';
import AnnouncementBanner from './components/AnnouncementBanner';

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
  const [page, setPage] = useState<'general' | 'special'>('general');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSpecialPasswordPromptOpen, setIsSpecialPasswordPromptOpen] = useState(false);
  const [specialPasswordError, setSpecialPasswordError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use separate Firestore hooks for each page
  const { data: generalItems, setData: setGeneralItems, loading: generalLoading, error: generalError } = useFirestore<DownloadItem>('downloadItems', DEFAULT_ITEMS);
  const { data: specialItems, setData: setSpecialItems, loading: specialLoading, error: specialError } = useFirestore<DownloadItem>('specialDownloadItems', []);

  // Dynamically select data and functions based on the current page
  const isGeneralPage = page === 'general';
  const downloadItems = isGeneralPage ? generalItems : specialItems;
  const setDownloadItems = isGeneralPage ? setGeneralItems : setSpecialItems;
  const loading = isGeneralPage ? generalLoading : specialLoading;
  const error = isGeneralPage ? generalError : specialError;
  const pageTitle = isGeneralPage ? 'General Work' : 'Special Work';

  const [aiSuggestions, setAiSuggestions] = useState<DownloadItem[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRefreshItem = async (itemId: string) => {
    const updatedItems = downloadItems.map(item =>
      item.id === itemId
        ? { ...item, lastRefreshed: new Date().toISOString() }
        : item
    );
    await setDownloadItems(updatedItems);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === '4452') {
      setIsPasswordPromptOpen(false);
      setIsSettingsOpen(true);
      setPasswordError(null);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleSpecialPasswordSubmit = (password: string) => {
    if (password === '4452') {
      setPage('special');
      setIsSpecialPasswordPromptOpen(false);
      setSpecialPasswordError(null);
    } else {
      setSpecialPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsGenerating(true);
    setAiSuggestions(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the search term "${searchTerm}", suggest up to 4 new download items that might be relevant in a corporate reporting context.
            For each item, provide a "title" and a "group" (e.g., "Sales Reports", "Financial Reports", "User Metrics", "Marketing").
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    group: { type: Type.STRING },
                                },
                                required: ["title", "group"]
                            }
                        }
                    },
                    required: ["suggestions"]
                }
            }
        });
        
        const cleanedJsonText = response.text.trim().replace(/^```json\s*/, '').replace(/```$/, '');
        // FIX: The result of JSON.parse is 'any'. Under stricter TypeScript rules, it could be 'unknown'.
        // By casting and then validating the structure, we make the code more type-safe and prevent potential runtime errors.
        const result = JSON.parse(cleanedJsonText) as { suggestions?: unknown[] };

        if (result && Array.isArray(result.suggestions)) {
            const newSuggestions: DownloadItem[] = result.suggestions
            .filter((s: any): s is { title: string; group: string } => s && typeof s.title === 'string' && typeof s.group === 'string')
            .map((s) => ({
                id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                title: s.title,
                group: s.group,
                downloadUrl: '#',
                refreshUrl: '#',
            }));
            setAiSuggestions(newSuggestions);
        } else {
            setAiSuggestions([]);
        }
    } catch (e) {
        console.error("Error generating AI suggestions:", e);
        setAiSuggestions([]);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAddSuggestion = (suggestion: DownloadItem) => {
    const { id, ...restOfSuggestion } = suggestion;
    const newItem: DownloadItem = {
      ...restOfSuggestion,
      id: new Date().getTime().toString(),
    };
    const newItems = [...downloadItems, newItem];
    setDownloadItems(newItems);
    setAiSuggestions(null); 
    setSearchTerm(''); 
  };

  const filteredItems = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return downloadItems;
    }
    return downloadItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.group?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [downloadItems, searchTerm]);

  const groupedItems = React.useMemo(() => {
    return filteredItems.reduce((acc, item) => {
    const group = item.group || 'Uncategorized';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, DownloadItem[]>);
  }, [filteredItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-center p-4">
         <div>
           <h2 className="text-2xl font-bold text-red-500 mb-2">Configuration Error</h2>
           <p className="text-slate-600 dark:text-slate-300 mb-4">
             Could not load settings from the database. Please check your Firebase project configuration.
           </p>
            <pre className="text-left bg-slate-200 dark:bg-slate-800 p-4 rounded-md text-sm text-red-500 overflow-x-auto">
                <code>{error}</code>
            </pre>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Hire Helper</h1>
            <div className="flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:placeholder-slate-500 dark:focus:placeholder-slate-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-900 dark:text-slate-200"
                aria-label="Search reports"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isGeneralPage ? () => setIsSpecialPasswordPromptOpen(true) : () => setPage('general')}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
                aria-label={isGeneralPage ? "Go to Special Work Page" : "Go to General Work Page"}
              >
                <SwitchHorizontalIcon className="h-5 w-5"/>
                <span>{isGeneralPage ? 'Special Work' : 'General Work'}</span>
              </button>
              <button
                onClick={() => setIsPasswordPromptOpen(true)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
                aria-label="Open settings"
              >
                <SettingsIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnnouncementBanner />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">{pageTitle} Page</h2>
        {filteredItems.length > 0 ? (
           <div className="space-y-12">
            {Object.entries(groupedItems).map(([groupName, items]) => (
              <section key={groupName}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{groupName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {items.map(item => (
                    <DownloadCard key={item.id} item={item} onRefresh={handleRefreshItem} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            {downloadItems.length === 0 ? (
                 <>
                    <h2 className="text-xl font-semibold mb-2">No Download Links Configured</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Click the settings icon in the top right to add your first download link.
                    </p>
                    <button
                    onClick={() => setIsPasswordPromptOpen(true)}
                    className="bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
                    >
                    Configure Now
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Your search for "{searchTerm}" did not match any items.
                    </p>
                    {searchTerm && (
                      <button
                        onClick={handleAiSearch}
                        disabled={isGenerating}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                      >
                        {isGenerating ? (
                            <>
                                <SpinnerIcon />
                                <span className="ml-2">Generating ideas...</span>
                            </>
                        ) : (
                            "✨ Get AI Suggestions"
                        )}
                      </button>
                    )}
                </>
            )}
          </div>
        )}
        {aiSuggestions && aiSuggestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">AI Suggestions for "{searchTerm}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {aiSuggestions.map(item => (
                <DownloadCard key={item.id} item={item} onRefresh={() => {}} onAdd={handleAddSuggestion} />
              ))}
            </div>
          </section>
        )}
      </main>

      <PasswordModal
        isOpen={isPasswordPromptOpen}
        onClose={() => {
          setIsPasswordPromptOpen(false);
          setPasswordError(null);
        }}
        onSubmit={handlePasswordSubmit}
        error={passwordError}
        title="Settings Access"
        description="Please enter the password to access settings."
      />
      
      <PasswordModal
        isOpen={isSpecialPasswordPromptOpen}
        onClose={() => {
          setIsSpecialPasswordPromptOpen(false);
          setSpecialPasswordError(null);
        }}
        onSubmit={handleSpecialPasswordSubmit}
        error={specialPasswordError}
        title="Access Restricted"
        description="Please enter the password to access the Special Work Page."
      />

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
