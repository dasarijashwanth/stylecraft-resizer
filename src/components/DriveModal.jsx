import React, { useState, useEffect } from 'react';
import { X, Cloud, ShieldAlert, Folder, Plus, CheckCircle, RefreshCw } from 'lucide-react';

export default function DriveModal({
  selectedCount,
  onUploadToDrive,
  onClose,
  isProcessing,
  progressCount,
  progressTotal,
}) {
  const [stage, setStage] = useState('connect'); // 'connect' | 'folders' | 'syncing' | 'success'
  const [account, setAccount] = useState(null);
  const [folders, setFolders] = useState([
    { id: 'f1', name: 'My Drive', count: 0 },
    { id: 'f2', name: 'Stylecraft Resizes', count: 12 },
    { id: 'f3', name: 'Social Media Templates', count: 4 },
  ]);
  const [selectedFolder, setSelectedFolder] = useState('f2');
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  // Sync stage to loading states
  useEffect(() => {
    if (isProcessing) {
      setStage('syncing');
    } else if (stage === 'syncing' && !isProcessing && progressCount === progressTotal && progressTotal > 0) {
      setStage('success');
    }
  }, [isProcessing, progressCount, progressTotal]);

  const handleConnect = () => {
    // Simulate google authorization flow
    setStage('syncing');
    setTimeout(() => {
      setAccount('jashwanthd@stylecraftus.com');
      setStage('folders');
    }, 1500);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    const newF = {
      id: `f_${Date.now()}`,
      name: newFolderName,
      count: 0,
    };
    setFolders([...folders, newF]);
    setSelectedFolder(newF.id);
    setNewFolderName('');
    setShowAddFolder(false);
  };

  const handleStartSync = () => {
    const targetFolder = folders.find((f) => f.id === selectedFolder)?.name || 'Stylecraft Resizes';
    onUploadToDrive(targetFolder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Cloud className="h-5 w-5 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Google Drive Cloud Sync
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={stage === 'syncing'}
            className={`p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-250 cursor-pointer ${
              stage === 'syncing' ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Stages */}
        <div className="p-6">
          {/* Stage 1: Connect Account */}
          {stage === 'connect' && (
            <div className="flex flex-col items-center justify-center text-center py-4 gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 flex items-center justify-center shadow-inner relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-2xl animate-pulse" />
                <Cloud className="w-8 h-8 text-blue-500 relative z-10" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Connect Google Workspace</h4>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-[280px] mt-1.5 leading-relaxed">
                  Authenticate client-side to sync your resized document packages directly into your Drive directory.
                </p>
              </div>

              <button
                onClick={handleConnect}
                className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                {/* Simulated Google colored logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.816 0-8.73-3.914-8.73-8.73s3.914-8.73 8.73-8.73c2.295 0 4.114.787 5.67 2.295l3.225-3.225C18.675 1.575 15.683.75 12.24.75 6.015.75 1 5.765 1 11.99s5.015 11.24 11.24 11.24c5.783 0 11.24-4.135 11.24-11.24 0-.787-.075-1.375-.24-1.705H12.24z" />
                </svg>
                Sign in with Google Drive
              </button>
            </div>
          )}

          {/* Stage 2: Select Directory Folders */}
          {stage === 'folders' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Account: {account}</span>
                <span className="font-bold text-blue-650 dark:text-blue-400">Linked</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
                  Select Backup Folder
                </label>

                {/* Folders List */}
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {folders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFolder(f.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedFolder === f.id
                          ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-950/5 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 text-zinc-700 dark:text-zinc-300 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <Folder className={`w-4 h-4 ${selectedFolder === f.id ? 'text-blue-500' : 'text-zinc-450'}`} />
                        <span>{f.name}</span>
                      </div>
                      <span className="text-[9px] font-bold opacity-60 font-mono">
                        {f.count} items
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create new folder toggle */}
              {!showAddFolder ? (
                <button
                  onClick={() => setShowAddFolder(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-zinc-450 dark:text-zinc-500 hover:text-indigo-650 dark:hover:text-indigo-400 mt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Folder
                </button>
              ) : (
                <form onSubmit={handleCreateFolder} className="flex gap-2 items-center mt-1 animate-fadeIn">
                  <input
                    type="text"
                    required
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 dark:text-zinc-200"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-650 hover:bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFolder(false)}
                    className="text-xs font-bold text-zinc-400 hover:text-zinc-650"
                  >
                    Cancel
                  </button>
                </form>
              )}

              <button
                onClick={handleStartSync}
                className="mt-3 py-3 w-full bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <Cloud className="w-4 h-4" />
                Upload Resizes ({selectedCount} items)
              </button>
            </div>
          )}

          {/* Stage 3: Syncing Progress Loader */}
          {stage === 'syncing' && (
            <div className="flex flex-col items-center justify-center text-center py-4 gap-4 animate-fadeIn">
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-zinc-100 dark:border-zinc-800 border-t-blue-500 animate-spin" />
                <div className="absolute">
                  <Cloud className="w-5 h-5 text-blue-500 animate-bounce" />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">
                  {progressTotal > 0 ? 'Syncing to Google Drive...' : 'Connecting to Drive API...'}
                </h4>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1 font-mono font-bold">
                  {progressTotal > 0 
                    ? `Processing file ${progressCount} of ${progressTotal}...`
                    : 'Awaiting credentials handshake...'}
                </p>
              </div>

              {progressTotal > 0 && (
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-full h-2.5 p-0.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((progressCount / progressTotal) * 100))}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Stage 4: Success checkmark */}
          {stage === 'success' && (
            <div className="flex flex-col items-center justify-center text-center py-4 gap-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 animate-pulse scale-105">
                <CheckCircle className="w-7 h-7" />
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">Sync Complete!</h4>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1.5 leading-relaxed">
                  Successfully backed up <span className="font-bold text-zinc-700 dark:text-zinc-350">{progressTotal} files</span> directly to folder <span className="font-bold text-blue-650 dark:text-blue-400">"{folders.find(f => f.id === selectedFolder)?.name || 'Stylecraft Resizes'}"</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-3">
                <button
                  onClick={() => setStage('folders')}
                  className="py-2.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Again
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
