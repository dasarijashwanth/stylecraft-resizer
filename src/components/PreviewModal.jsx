import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, Move, ShieldCheck, Cloud } from 'lucide-react';
import { resizeImage, canvasToBlob, imageToDocBlob } from '../utils/imageProcessors';
import { saveAs } from 'file-saver';

/**
 * A highly reliable native browser download trigger.
 * Bypasses iframe / pop-up sandboxing restrictions by programmatically
 * clicking a temporary document anchor element, falling back to file-saver.
 */
function triggerDownload(blob, filename) {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Native download helper failed, falling back to file-saver:", err);
    saveAs(blob, filename);
  }
}

export default function PreviewModal({
  size,
  imageElement,
  bgType,
  bgColor,
  exportFormat,
  quality,
  documentMode,
  ultraClarity,
  clarityEngine,
  aiStyle = 'mirror',
  aiPrompt = '',
  onClose,
  onSaveToDrive,
  isSavingToDrive = false,
  aiGeneratedImageElement = null,
  sizingMode = 'fit',
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [renderingStyle, setRenderingStyle] = useState('auto'); // 'auto' | 'pixelated'

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Generate the full-resolution preview image URL on mount (Always PNG for screen rendering)
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    // Run canvas generation asynchronously to avoid freezing the UI
    setTimeout(async () => {
      try {
        const canvas = resizeImage(
          imageElement, 
          size.width, 
          size.height, 
          bgType, 
          bgColor, 
          ultraClarity, 
          clarityEngine,
          aiStyle,
          aiPrompt,
          aiGeneratedImageElement,
          sizingMode
        );
        if (canvas && active) {
          const blob = await canvasToBlob(canvas, 'image/png'); // Display as PNG on screen
          const url = URL.createObjectURL(blob);
          if (active) {
            setPreviewUrl(url);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 50);

    return () => {
      active = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [size, imageElement, bgType, bgColor, ultraClarity, clarityEngine, aiStyle, aiPrompt, aiGeneratedImageElement, sizingMode]);

  // Handle Zoom In / Zoom Out
  const handleZoom = (type) => {
    if (type === 'in') {
      setScale((s) => Math.min(4, s + 0.5));
    } else {
      setScale((s) => {
        const newScale = Math.max(1, s - 0.5);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 }); // Reset offset at 1x
        }
        return newScale;
      });
    }
  };

  // Dragging event handlers
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  // Trigger download directly from modal
  const handleDownload = async () => {
    if (!imageElement) return;
    setIsLoading(true);

    const activeFormat = exportFormat;
    const activeQuality = documentMode ? 1.0 : quality;
    const baseName = imageElement.src.substring(imageElement.src.lastIndexOf('/') + 1).split('.')[0] || 'resized';
    const outputName = size.filename || `${baseName}_${size.width}x${size.height}`;

    try {
      const canvas = resizeImage(imageElement, size.width, size.height, bgType, bgColor, ultraClarity, clarityEngine, aiStyle, aiPrompt, aiGeneratedImageElement, sizingMode);
      if (!canvas) throw new Error('Canvas render failed');

      if (activeFormat === 'application/msword') {
        const pngBlob = await canvasToBlob(canvas, 'image/png');
        const docBlob = await imageToDocBlob(pngBlob, size.name, size.width, size.height);
        triggerDownload(docBlob, `${outputName}.doc`);
      } else {
        const blob = await canvasToBlob(canvas, activeFormat, activeQuality);
        const mimeToExt = {
          'image/png': 'png',
          'image/jpeg': 'jpg',
          'image/webp': 'webp',
        };
        const ext = mimeToExt[activeFormat] || 'png';
        triggerDownload(blob, `${outputName}.${ext}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90svh] flex flex-col shadow-2xl overflow-hidden animate-slideIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-5">
          <div>
            <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
              {size.category}
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
              {size.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-medium mt-0.5">
              {size.width} × {size.height} px • {clarityEngine === 'hermite' ? 'Hermite Sharp Resample' : clarityEngine === 'pixelated' ? 'Pixelated Resample' : 'Bicubic Resample'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-700/50 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-150 transition-all cursor-pointer"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Main Viewport */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className={`flex-1 min-h-[300px] md:min-h-[400px] bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative ${
            scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Generating sharp resolution...</span>
            </div>
          ) : (
            <div 
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                width: `${size.width}px`,
                height: `${size.height}px`,
                maxWidth: '85%',
                maxHeight: '85%',
                aspectRatio: `${size.width} / ${size.height}`
              }}
              className="relative overflow-hidden flex items-center justify-center select-none rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900"
            >
              <img
                ref={imageRef}
                src={previewUrl}
                alt={size.name}
                draggable={false}
                style={{ 
                  imageRendering: renderingStyle,
                  objectFit: 
                    sizingMode === 'fit' ? 'contain' : 
                    sizingMode === 'fill' ? 'cover' : 
                    sizingMode === 'stretch' ? 'fill' : 
                    sizingMode === 'background_stretch' ? 'cover' :
                    sizingMode === 'enlarge_to_frame' ? 'cover' :
                    'contain',
                  width: '100%',
                  height: '100%'
                }}
                className="transition-opacity duration-300"
              />
            </div>
          )}

          {/* Scale Indicator */}
          {scale > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-white flex items-center gap-1.5 pointer-events-none select-none">
              <Move className="h-3.5 w-3.5" />
              Zoom: {Math.round(scale * 100)}%
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/55 dark:bg-zinc-900/35">
          {/* Rendering style controls */}
          <div className="flex bg-zinc-150/50 dark:bg-zinc-950/50 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800 shrink-0 text-xs">
            <button
              onClick={() => setRenderingStyle('auto')}
              className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                renderingStyle === 'auto'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
              }`}
            >
              Smooth scale
            </button>
            <button
              onClick={() => setRenderingStyle('pixelated')}
              className={`px-3 py-1 rounded font-semibold cursor-pointer ${
                renderingStyle === 'pixelated'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-550 dark:text-zinc-450 hover:text-zinc-800'
              }`}
            >
              Pixelated grid
            </button>
          </div>

          {/* Zoom controls & Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shrink-0">
              <button
                onClick={() => handleZoom('out')}
                disabled={scale <= 1 || isLoading}
                className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <div className="px-2 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 select-none border-x border-zinc-200 dark:border-zinc-800 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </div>
              <button
                onClick={() => handleZoom('in')}
                disabled={scale >= 4 || isLoading}
                className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => onSaveToDrive(size)}
              disabled={isLoading || isSavingToDrive}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-40 transition-all select-none w-full sm:w-auto justify-center"
            >
              {isSavingToDrive ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Cloud className="h-4 w-4" />
              )}
              {isSavingToDrive ? 'Saving...' : 'Save to Drive'}
            </button>

            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs cursor-pointer shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 disabled:opacity-40 transition-all select-none w-full sm:w-auto justify-center"
            >
              <Download className="h-4 w-4" />
              Download {exportFormat === 'application/msword' ? 'Word Doc' : 'Image'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
