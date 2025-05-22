import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const TransformContext = createContext<{
    position: { x: number, y: number },
    setPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>,
    mouseToCanvas: (mouse: { x: number, y: number }) => { x: number, y: number },
    canvasToMouse: (canvas: { x: number, y: number }) => { x: number, y: number },
}>({
    position: { x: 0, y: 0 },
    setPosition: () => {},
    mouseToCanvas: () => ({ x: 0, y: 0 }),
    canvasToMouse: () => ({ x: 0, y: 0 }),
});

// Provider component
export const TransformProvider = ({ children }: { children: ReactNode }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    function mouseToCanvas(mouse: { x: number, y: number }) {
        return {
            x: mouse.x - position.x,
            y: mouse.y - position.y
        };
    }

    function canvasToMouse(canvas: { x: number, y: number }) {
        return {
            x: canvas.x + position.x,
            y: canvas.y + position.y
        };
    }

    const value = useMemo(() => ({
        position,
        setPosition,
        mouseToCanvas,
        canvasToMouse
    }), [position]);

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