import React, { useRef, useEffect, useState } from 'react';

export default function RedactionCanvas({ imageUrl, onComplete, onCancel }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);
    const [rectangles, setRectangles] = useState([]);
    
    // Load image and setup canvas
    useEffect(() => {
        if (!imageUrl || !canvasRef.current || !containerRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Scale canvas to fit container width, maintaining aspect ratio
            const containerWidth = containerRef.current.clientWidth;
            const scale = containerWidth / img.width;
            
            canvas.width = containerWidth;
            canvas.height = img.height * scale;
            
            // Draw initial image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Draw any existing rectangles (in case of re-render)
            rectangles.forEach(rect => {
                ctx.fillStyle = '#0f172a'; // slate-950
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
        };
        img.src = imageUrl;
    }, [imageUrl, rectangles]);

    const getCoordinates = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const pos = getCoordinates(e);
        setStartPos(pos);
        setCurrentPos(pos);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        setCurrentPos(getCoordinates(e));
        
        // Redraw canvas to show preview rectangle
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear and redraw image
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Draw saved rectangles
            ctx.fillStyle = '#0f172a';
            rectangles.forEach(rect => {
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
            
            // Draw current dragging rectangle
            if (startPos && currentPos) {
                const width = currentPos.x - startPos.x;
                const height = currentPos.y - startPos.y;
                
                // Draw a translucent preview box
                ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; 
                ctx.fillRect(startPos.x, startPos.y, width, height);
                // Draw dashed border
                ctx.strokeStyle = '#fff';
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(startPos.x, startPos.y, width, height);
                ctx.setLineDash([]);
            }
        };
        img.src = imageUrl;
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        
        if (startPos && currentPos) {
            const width = currentPos.x - startPos.x;
            const height = currentPos.y - startPos.y;
            
            // Only add if it's not a tiny click
            if (Math.abs(width) > 10 && Math.abs(height) > 10) {
                setRectangles([...rectangles, {
                    x: Math.min(startPos.x, currentPos.x),
                    y: Math.min(startPos.y, currentPos.y),
                    width: Math.abs(width),
                    height: Math.abs(height)
                }]);
            }
        }
        setStartPos(null);
        setCurrentPos(null);
    };

    const handleUndo = () => {
        setRectangles(rectangles.slice(0, -1));
    };

    const handleComplete = () => {
        // Export final canvas as base64
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
        onComplete(base64);
    };

    return (
        <div className="flex flex-col animate-fade-in w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Censor Private Info</h2>
                    <p className="text-slate-500">Click and drag to draw black boxes over your Name, Account Numbers, and Balances.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-full text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors flex-1 md:flex-none text-center"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUndo}
                        disabled={rectangles.length === 0}
                        className="px-5 py-2.5 rounded-full text-slate-700 font-bold bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors flex-1 md:flex-none text-center"
                    >
                        Undo
                    </button>
                    <button 
                        onClick={handleComplete}
                        className="px-6 py-2.5 rounded-full text-white font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-colors flex-1 md:flex-none text-center"
                    >
                        Analyze Data
                    </button>
                </div>
            </div>

            <div 
                ref={containerRef}
                className="w-full bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 cursor-crosshair relative shadow-inner"
            >
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Local Censor Mode Active
                </div>
                <canvas 
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="w-full h-auto touch-none"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
            </div>
            
            <p className="text-xs text-center text-slate-400 mt-4 max-w-xl mx-auto">
                Any black boxes you draw are permanent and flattened into the image. Our servers and the AI will completely ignore those sections.
            </p>
        </div>
    );
}
