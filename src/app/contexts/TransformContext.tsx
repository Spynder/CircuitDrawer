import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const TransformContext = createContext<{
    position: { x: number, y: number },
    setPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>,
    scale: number,
    setScale: React.Dispatch<React.SetStateAction<number>>,
    mouseToCanvas: (mouse: { x: number, y: number }) => { x: number, y: number },
    canvasToMouse: (canvas: { x: number, y: number }) => { x: number, y: number },
}>({
    position: { x: 0, y: 0 },
    setPosition: () => {},
    scale: 1,
    setScale: () => {},
    mouseToCanvas: () => ({ x: 0, y: 0 }),
    canvasToMouse: () => ({ x: 0, y: 0 }),
});

// Provider component
export const TransformProvider = ({ children }: { children: ReactNode }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    function mouseToCanvas(mouse: { x: number, y: number }) {
        return {
            x: (mouse.x - position.x) / scale,
            y: (mouse.y - position.y) / scale
        };
    }
    
    function canvasToMouse(canvas: { x: number, y: number }) {
        return {
            x: (canvas.x * scale) + position.x,
            y: (canvas.y * scale) + position.y
        };
    }

    const value = useMemo(() => ({
        position,
        setPosition,
        scale,
        setScale,
        mouseToCanvas,
        canvasToMouse
    }), [position, scale]);

    return (
        <TransformContext.Provider value={value}>
            {children}
        </TransformContext.Provider>
    );
};

// Custom hook for easy access to transform values
export const useTransform = () => {
    const context = useContext(TransformContext);
    if (!context) {
        throw new Error('useTransform must be used within a TransformProvider');
    }
    return context;
};