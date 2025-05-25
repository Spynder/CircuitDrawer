import { ApplicationRef } from "@pixi/react";
import { Container } from "pixi.js";
import { createContext, ReactNode, useContext, useState } from "react";
import { useElements } from "./ElementsContext";

const ConfigContext = createContext<{
    showGrid: boolean,
    setShowGrid: (showGrid: boolean) => void,
    downloadImage: () => void,
    app: ApplicationRef | null,
    containerFrame: Container | null,
    setApp: (app: ApplicationRef | null) => void,
    setContainerFrame: (containerFrame: Container | null) => void,
    requestSave: () => void,
    requestLoad: () => void
}>({
    showGrid: true,
    setShowGrid: (showGrid: boolean) => {},
    downloadImage: () => {},
    app: null,
    containerFrame: null,
    setApp: (app: ApplicationRef | null) => {},
    setContainerFrame: (containerFrame: Container | null) => {},
    requestSave: () => {},
    requestLoad: () => {}
});

// Provider component
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [showGrid, setShowGrid] = useState(true);
    const [app, setApp] = useState<ApplicationRef | null>(null);
    const [containerFrame, setContainerFrame] = useState<Container | null>(null);
    const { saveCircuit, loadCircuit } = useElements();

    const value = {
        showGrid,
        setShowGrid,
        downloadImage,
        app,
        containerFrame,
        setApp,
        setContainerFrame,
        requestSave,
        requestLoad
    };

    async function downloadImage() {
        if(!app || !containerFrame) return;
        const url = await app.getApplication()?.renderer.extract.base64(containerFrame);
        if(!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'circuit.png';
        link.click();
    }

    async function requestSave() {
        const data = saveCircuit();
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'circuit.json';
        link.click();
    }

    async function requestLoad() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result as string;
                loadCircuit(data);
            };
            reader.readAsText(file);
        };
        input.click();
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