"use client";

import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/useSocket";
import { 
  Square, 
  Circle, 
  Minus, 
  ArrowRight, 
  Type, 
  Pencil, 
  Diamond,
  MousePointer2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Hand
} from "lucide-react";
import { ParamValue } from "next/dist/server/request/params";

enum Shape {
  rectangle = "rectangle",
  diamond = "diamond",
  circle = "circle",
  line = "line",
  arrow = "arrow",
  text = "text",
  freeHand = "freeHand"
}

enum Tool {
  select = "select",
  pan = "pan",
  erase = "erase"
}

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  id: string;
  shape: Shape;
  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  font?: string;
  fontSize?: string;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
  points?: Point[];
}

interface DrawingPanelProps {
  drawings: any[];
  roomId?: string;
  slug?: ParamValue;
}

export default function DrawingPanel({ drawings, roomId, slug }: DrawingPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape | Tool>(Tool.select);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  
  // Styles
  const [strokeColor, setStrokeColor] = useState("#ff6b35");
  const [fillColor, setFillColor] = useState("transparent");
  const [lineWidth, setLineWidth] = useState(2);
  
  // Camera controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const { ws, isConnected } = useWebSocket();

  // Listen for WebSocket messages
  useEffect(() => {
    if (!ws || !isConnected) return;

    ws.send(JSON.stringify({ type: "join_room", roomId: slug }));

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "draw" && data.element) {
          // Add received drawing to elements
          setElements((prev) => [...prev, data.element]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket drawing message:", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.send(JSON.stringify({ type: "leave_room", roomId: slug }));
    };
  }, [ws, isConnected,slug]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Redraw all elements
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply camera transform
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Draw current element being created
    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    ctx.restore();
  };

  useEffect(() => {
    redraw();
  }, [elements, currentElement, zoom, pan]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 0.5;

    const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize;
    const endX = Math.ceil((width - pan.x) / zoom / gridSize) * gridSize;
    const endY = Math.ceil((height - pan.y) / zoom / gridSize) * gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    ctx.strokeStyle = element.strokeStyle;
    ctx.fillStyle = element.fillStyle;
    ctx.lineWidth = element.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (element.shape) {
      case Shape.rectangle:
        if (element.startX !== undefined && element.startY !== undefined && 
            element.endX !== undefined && element.endY !== undefined) {
          const width = element.endX - element.startX;
          const height = element.endY - element.startY;
          ctx.beginPath();
          ctx.rect(element.startX, element.startY, width, height);
          if (element.fillStyle !== "transparent") ctx.fill();
          ctx.stroke();
        }
        break;

      case Shape.circle:
        if (element.startX !== undefined && element.startY !== undefined && 
            element.endX !== undefined && element.endY !== undefined) {
          const radius = Math.sqrt(
            Math.pow(element.endX - element.startX, 2) + 
            Math.pow(element.endY - element.startY, 2)
          );
          ctx.beginPath();
          ctx.arc(element.startX, element.startY, radius, 0, 2 * Math.PI);
          if (element.fillStyle !== "transparent") ctx.fill();
          ctx.stroke();
        }
        break;

      case Shape.diamond:
        if (element.startX !== undefined && element.startY !== undefined && 
            element.endX !== undefined && element.endY !== undefined) {
          const centerX = (element.startX + element.endX) / 2;
          const centerY = (element.startY + element.endY) / 2;
          const width = element.endX - element.startX;
          const height = element.endY - element.startY;
          
          ctx.beginPath();
          ctx.moveTo(centerX, element.startY);
          ctx.lineTo(element.endX, centerY);
          ctx.lineTo(centerX, element.endY);
          ctx.lineTo(element.startX, centerY);
          ctx.closePath();
          if (element.fillStyle !== "transparent") ctx.fill();
          ctx.stroke();
        }
        break;

      case Shape.line:
        if (element.startX !== undefined && element.startY !== undefined && 
            element.endX !== undefined && element.endY !== undefined) {
          ctx.beginPath();
          ctx.moveTo(element.startX, element.startY);
          ctx.lineTo(element.endX, element.endY);
          ctx.stroke();
        }
        break;

      case Shape.arrow:
        if (element.startX !== undefined && element.startY !== undefined && 
            element.endX !== undefined && element.endY !== undefined) {
          const headLength = 15;
          const angle = Math.atan2(element.endY - element.startY, element.endX - element.startX);
          
          ctx.beginPath();
          ctx.moveTo(element.startX, element.startY);
          ctx.lineTo(element.endX, element.endY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(element.endX, element.endY);
          ctx.lineTo(
            element.endX - headLength * Math.cos(angle - Math.PI / 6),
            element.endY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(element.endX, element.endY);
          ctx.lineTo(
            element.endX - headLength * Math.cos(angle + Math.PI / 6),
            element.endY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case Shape.freeHand:
        if (element.points && element.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case Shape.text:
        if (element.text && element.startX !== undefined && element.startY !== undefined) {
          ctx.font = `${element.fontSize || "16px"} ${element.font || "Arial"}`;
          ctx.fillStyle = element.strokeStyle;
          ctx.fillText(element.text, element.startX, element.startY);
        }
        break;
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (selectedTool === Tool.pan || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (selectedTool === Tool.select || selectedTool === Tool.erase) return;

    setIsDrawing(true);

    const newElement: DrawElement = {
      id: `temp-${Date.now()}`,
      shape: selectedTool as Shape,
      strokeStyle: strokeColor,
      fillStyle: fillColor,
      lineWidth: lineWidth,
      startX: pos.x,
      startY: pos.y,
      endX: pos.x,
      endY: pos.y,
      points: selectedTool === Shape.freeHand ? [pos] : undefined
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan({ x: pan.x + deltaX, y: pan.y + deltaY });
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing || !currentElement) return;

    const pos = getMousePos(e);

    if (currentElement.shape === Shape.freeHand) {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), pos]
      });
    } else {
      setCurrentElement({
        ...currentElement,
        endX: pos.x,
        endY: pos.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!isDrawing || !currentElement) return;

    setIsDrawing(false);
    
    // Add element to list
    const finalElement = { ...currentElement, id: `${Date.now()}-${Math.random()}` };
    setElements([...elements, finalElement]);
    setCurrentElement(null);

    // Send to WebSocket
    if (ws && isConnected && slug) {
      ws.send(JSON.stringify({
        type: "draw",
        roomId: slug,
        element: finalElement
      }));
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(Math.max(0.1, Math.min(3, zoom + delta)));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      handleZoom(-e.deltaY * 0.001);
    }
  };

  const tools = [
    { id: Tool.select, icon: MousePointer2, label: "Select" },
    { id: Tool.pan, icon: Hand, label: "Pan" },
    { id: Shape.rectangle, icon: Square, label: "Rectangle" },
    { id: Shape.circle, icon: Circle, label: "Circle" },
    { id: Shape.diamond, icon: Diamond, label: "Diamond" },
    { id: Shape.line, icon: Minus, label: "Line" },
    { id: Shape.arrow, icon: ArrowRight, label: "Arrow" },
    { id: Shape.freeHand, icon: Pencil, label: "Draw" },
    { id: Shape.text, icon: Type, label: "Text" },
    { id: Tool.erase, icon: Trash2, label: "Erase" }
  ];

  return (
    <div className="relative w-full h-full bg-[#0a0a0a]">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#333] p-2 flex gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-2 rounded transition-all ${
                selectedTool === tool.id
                  ? "bg-[#ff6b35] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }`}
              title={tool.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Style Controls */}
      <div className="absolute top-20 left-4 z-10 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#333] p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Stroke</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Fill</label>
          <input
            type="color"
            value={fillColor === "transparent" ? "#000000" : fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-full h-8 rounded cursor-pointer"
          />
          <button
            onClick={() => setFillColor("transparent")}
            className="text-xs text-gray-400 hover:text-white mt-1"
          >
            Transparent
          </button>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Width: {lineWidth}px</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#333] p-2 flex flex-col gap-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded"
        >
          <ZoomIn size={20} />
        </button>
        <span className="text-xs text-gray-400 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="text-xs text-gray-400 hover:text-white px-2 py-1"
        >
          Reset
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDrawing(false);
          setIsPanning(false);
        }}
        onWheel={handleWheel}
        className="w-full h-full cursor-crosshair"
        style={{
          cursor: isPanning || selectedTool === Tool.pan ? "grab" : "crosshair"
        }}
      />

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#333] px-3 py-2 text-xs text-gray-400">
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "● Connected" : "○ Disconnected"}
        </span>
        <span className="mx-2">|</span>
        <span>{elements.length} elements</span>
      </div>
    </div>
  );
}