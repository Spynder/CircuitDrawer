import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { GRID_SNAP, GateType } from "../Constants";

interface ElementParams {
    position: { x: number, y: number };
    type: "gate" | "node" | "label";
    gateType?: GateType;
    label?: string;
    id: string;
}

interface WireParams {
    start: string,
    end: string
    id: string;
}


function snapPoint(point: {x: number, y: number}) {
    return {
        x: Math.round(point.x / GRID_SNAP) * GRID_SNAP,
        y: Math.round(point.y / GRID_SNAP) * GRID_SNAP
    };
}

const ElementsContext = createContext<{
    elements: { [key: string]: ElementParams },
    wires: { [key: string]: WireParams },
    createNode: (position: {x: number, y: number}) => string,
    editWire: (id: string, start: string, end: string) => void,
    addNewWire: (point: {x: number, y: number}, from?: string) => { start: string; end: string; id: string; },
    moveElement: (id: string, point: {x: number, y: number}) => void,
    connectNewWire: (start: string, end: string) => { start: string; end: string; id: string; },
    checkOverlappingNodes: (id: string) => boolean,
    deleteElement: (id: string) => void,
    deleteWire: (id: string) => void,
    createGate: (type: GateType) => string,
    createLabel: (label: string) => string,
}>({
    elements: {},
    wires: {},
    createNode: () => "",
    editWire: () => {},
    addNewWire: () => ({
        start: "",
        end: "",
        id: ""
    }),
    moveElement: () => {},
    connectNewWire: () => ({
        start: "",
        end: "",
        id: ""
    }),
    checkOverlappingNodes: () => false,
    deleteElement: () => {},
    deleteWire: () => {},
    createGate: (type: GateType) => "",
    createLabel: (label: string) => "",
});

export const ElementsProvider = ({ children }: { children: ReactNode }) => {
    const [elements, setElements] = useState<{[key: string]: ElementParams}>({});
    const [wires, setWires] = useState<{[key: string]: WireParams}>({});

    function createNode(position: {x: number, y: number}) {
        let uuid = crypto.randomUUID();
        setElements((prev) => ({...prev, [uuid]: {
            position: snapPoint(position),
            type: "node",
            id: uuid
        }}));
        return uuid;
    }

    function addNewWire(point: {x: number, y: number}, from?: string) {
        let start = from ?? createNode(point);
        let end = createNode(point);
        let wire = crypto.randomUUID();
        setWires((prev) => ({...prev, [wire]: {
            start: start,
            end: end,
            id: wire
        }}));
        return {
            start: start,
            end: end,
            id: wire
        };
    }

    function moveElement(id: string, point: {x: number, y: number}) {
        setElements((prev) => ({...prev, [id]: {
            ...prev[id],
            position: snapPoint(point),
        }}));
    }

    function editWire(id: string, start: string, end: string) {
        setWires((prev) => ({...prev, [id]: {
            ...prev[id],
            start: start,
            end: end,
        }}));
    }

    function connectNewWire(start: string, end: string) {
        let wire = crypto.randomUUID();
        setWires((prev) => ({...prev, [wire]: {
            start: start,
            end: end,
            id: wire
        }}));
        return {
            start: start,
            end: end,
            id: wire
        };
    }

    function pruneLonelyNodes() {
        console.log("Starting pruning")
        setElements((prev) => {
            let newElements = {...prev};
            for(let element of Object.values(newElements)) {
                if(element.type === "node") {
                    let amount = Object.values(wires).filter(wire => wire.start === element.id || wire.end === element.id).length;
                    if(amount === 0) {
                        delete newElements[element.id];
                        console.log("Pruned", element.id)
                    }
                }
            }
            return newElements;
        });
    }

    useEffect(() => {
        pruneLonelyNodes();
    }, [JSON.stringify(wires)]);

    function checkOverlappingNodes(id: string) {
        for(let element of Object.values(elements)) {
            if(element.type === "node") {
                //console.log(element, elements[id], id)
                if(!element || !elements[id]) continue;
                if(element.position.x === elements[id].position.x &&
                   element.position.y === elements[id].position.y &&
                   element.id !== id) {
                    let nodeID = element.id;
                    // prune node and rewire all wires
                    setWires((prev) => {
                        let newWires = {...prev};
                        for(let wire of Object.values(newWires)) {
                            if(wire.start == nodeID) {
                                newWires[wire.id].start = id;
                            }
                            if(wire.end == nodeID) {
                                newWires[wire.id].end = id;
                            }
                        }
                        return newWires;
                    });
                    return true;
                }
            }
        }
        return false;
    }

    function deleteWire(id: string) {
        setWires((prev) => {
            let newWires = {...prev};
            delete newWires[id];
            return newWires;
        });
        pruneLonelyNodes();
    }
    
    function deleteElement(id: string) {
        for(let wire of Object.values(wires)) {
            if(wire.start === id || wire.end === id) {
                deleteWire(wire.id);
            }
        }
        setElements((prev) => {
            let newElements = {...prev};
            delete newElements[id];
            return newElements;
        });
    }

    function createGate(type: GateType) {
        let uuid = crypto.randomUUID();
        setElements((prev) => ({...prev, [uuid]: {
            position: snapPoint({x: 0, y: 0}),
            type: "gate",
            gateType: type,
            id: uuid
        }}));
        return uuid;
    }

    function createLabel(label: string) {
        let uuid = crypto.randomUUID();
        setElements((prev) => ({...prev, [uuid]: {
            position: snapPoint({x: 0, y: 0}),
            type: "label",
            label: label,
            id: uuid
        }}));
        return uuid;
    }


    const value = useMemo(() => ({
        elements,
        wires,
        createNode,
        addNewWire,
        moveElement,
        connectNewWire,
        editWire,
        checkOverlappingNodes,
        deleteElement,
        deleteWire,
        createGate,
        createLabel
    }), [elements, wires]);

    return (
        <ElementsContext.Provider value={value}>
            {children}
        </ElementsContext.Provider>
    );
};

// Custom hook for easy access to transform values
export const useElements = () => {
    const context = useContext(ElementsContext);
    if (!context) {
        throw new Error('useElements must be used within a ElementsProvider');
    }
    return context;
};