import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const RedactionCanvas = forwardRef(({ imageUrl, index }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);
    const [rectangles, setRectangles] = useState([]);
    
    useImperativeHandle(ref, () => ({
        getBase64: () => {
            if (!canvasRef.current) return null;
            return canvasRef.current.toDataURL('image/jpeg', 0.8);
        },
        undo: () => {
            setRectangles(rectangles.slice(0, -1));
        },
        canUndo: rectangles.length > 0
    }));
    
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

    return (
        <div className="flex flex-col animate-fade-in w-full mb-8">
            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-bold text-slate-500">Image {index + 1}</span>
                {rectangles.length > 0 && (
                    <button 
                        onClick={() => setRectangles(rectangles.slice(0, -1))}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                        Undo last redaction
                    </button>
                )}
            </div>
            <div 
                ref={containerRef}
                className="w-full bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 cursor-crosshair relative shadow-inner"
            >
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Local Censor Mode
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
        </div>
    );
});

export default RedactionCanvas;
