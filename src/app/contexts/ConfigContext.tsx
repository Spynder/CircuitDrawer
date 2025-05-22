import { ApplicationRef } from "@pixi/react";
import { Container } from "pixi.js";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const ConfigContext = createContext<{
    showGrid: boolean,
    setShowGrid: (showGrid: boolean) => void,
    downloadImage: () => void,
    app: ApplicationRef | null,
    containerFrame: Container | null,
    setApp: (app: ApplicationRef | null) => void,
    setContainerFrame: (containerFrame: Container | null) => void
}>({
    showGrid: true,
    setShowGrid: (showGrid: boolean) => {},
    downloadImage: () => {},
    app: null,
    containerFrame: null,
    setApp: (app: ApplicationRef | null) => {},
    setContainerFrame: (containerFrame: Container | null) => {}
});

// Provider component
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [showGrid, setShowGrid] = useState(true);
    const [app, setApp] = useState<ApplicationRef | null>(null);
    const [containerFrame, setContainerFrame] = useState<Container | null>(null);

    const value = useMemo(() => ({
        showGrid,
        setShowGrid,
        downloadImage,
        app,
        containerFrame,
        setApp,
        setContainerFrame
    }), [showGrid, app, containerFrame]);

    async function downloadImage() {
        if(!app || !containerFrame) return;
        const url = await app.getApplication()?.renderer.extract.base64(containerFrame);
        if(!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'circuit.png';
        link.click();
    }

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
};

// Custom hook for easy access to transform values
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};