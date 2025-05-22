import { createContext, ReactNode, useContext, useMemo, useState } from "react";

const ConfigContext = createContext<{
    showGrid: boolean,
    setShowGrid: (showGrid: boolean) => void,
}>({
    showGrid: true,
    setShowGrid: (showGrid: boolean) => {},
});

// Provider component
export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [showGrid, setShowGrid] = useState(true);

    const value = useMemo(() => ({
        showGrid,
        setShowGrid,
    }), [showGrid]);

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