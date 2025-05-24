import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GRID_SNAP, GateConfig, GateType } from "../Constants";

interface ElementParams {
    position: { x: number, y: number };
    type: "gate" | "node" | "label";
    gateType?: GateType;
    label?: string;
    id: string;
}

export interface WireParams {
    start: string,
    startPort: number,
    end: string,
    endPort: number,
    id: string;
}


export function snapPoint(point: {x: number, y: number}) {
    return {
        x: Math.round(point.x / GRID_SNAP) * GRID_SNAP,
        y: Math.round(point.y / GRID_SNAP) * GRID_SNAP
    };
}

const ElementsContext = createContext<{
    elements: { [key: string]: ElementParams },
    wires: { [key: string]: WireParams },
    createNode: (position: {x: number, y: number}) => string,
    editWire: (id: string, start: string, end: string, startPort?: number, endPort?: number) => void,
    addNewWire: (point: {x: number, y: number}, from?: string, fromPort?: number) => WireParams,
    moveElement: (id: string, point: {x: number, y: number}) => void,
    connectNewWire: (start: string, end: string, startPort?: number, endPort?: number) => WireParams,
    deleteElement: (id: string) => void,
    deleteWire: (id: string) => void,
    createGate: (type: GateType) => string,
    createLabel: (label: string) => string,
    cleanUp: (id: string) => void,
    saveCircuit: () => string,
    loadCircuit: (data: string) => void
}>({
    elements: {},
    wires: {},
    createNode: () => "",
    editWire: () => {},
    addNewWire: () => ({
        start: "",
        end: "",
        startPort: 0,
        endPort: 0,
        id: ""
    }),
    moveElement: () => {},
    connectNewWire: () => ({
        start: "",
        end: "",
        startPort: 0,
        endPort: 0,
        id: ""
    }),
    deleteElement: () => {},
    deleteWire: () => {},
    createGate: () => "",
    createLabel: () => "",
    cleanUp: () => {},
    saveCircuit: () => "",
    loadCircuit: () => {}
});

function pointInRect(point: {x: number, y: number}, rect: {x: number, y: number, width: number, height: number}) {
    return point.x >= rect.x && point.x <= rect.x + rect.width &&
           point.y >= rect.y && point.y <= rect.y + rect.height;
}

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

    function addNewWire(point: {x: number, y: number}, from?: string, fromPort?: number) {
        let start = from ?? createNode(point);
        let end = createNode(point);
        let wire = crypto.randomUUID();
        setWires((prev) => ({...prev, [wire]: {
            start: start,
            startPort: fromPort ?? 0,
            end: end,
            endPort: 0,
            id: wire
        }}));
        return {
            start: start,
            startPort: fromPort ?? 0,
            end: end,
            endPort: 0,
            id: wire
        };
    }

    function moveElement(id: string, point: {x: number, y: number}) {
        setElements((prev) => {
            let newElements = {...prev};
            if(!newElements[id]) return prev;
            newElements[id].position = snapPoint(point);
            return newElements;
        });
    }

    function editWire(id: string, start: string, end: string, startPort?: number, endPort?: number) {
        setWires((prev) => ({...prev, [id]: {
            ...prev[id],
            start: start,
            end: end,
            startPort: startPort ?? 0,
            endPort: endPort ?? 0,
        }}));
    }

    function connectNewWire(start: string, end: string) {
        let wire = crypto.randomUUID();
        setWires((prev) => ({...prev, [wire]: {
            start: start,
            startPort: 0,
            end: end,
            endPort: 0,
            id: wire
        }}));
        return {
            start: start,
            startPort: 0,
            end: end,
            endPort: 0,
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
                                newWires[wire.id].startPort = 0;
                            }
                            if(wire.end == nodeID) {
                                newWires[wire.id].end = id;
                                newWires[wire.id].endPort = 0;
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

    function convertNodeToGateConnection(nodeID: string) {
        const nodeData = elements[nodeID];
        if(!nodeData || nodeData.type !== "node") return;
        const associatedWires = Object.values(wires).filter(x => x.start === nodeID || x.end === nodeID);
        for(let element of Object.values(elements)) {
            if(element.type === "gate") {
                const gateConfig = GateConfig[element.gateType!];
                const box = {
                    x: element.position.x,
                    y: element.position.y,
                    width: gateConfig.width,
                    height: gateConfig.height
                }
                if(pointInRect(nodeData.position, box)) {
                    const connectionPoints = [];
                    if(gateConfig.inputs) {
                        for(let i in gateConfig.inputs) {
                            const input = gateConfig.inputs[i];
                            connectionPoints.push({
                                x: element.position.x,
                                y: element.position.y + input.y,
                                port: Number(i),
                                type: "input"
                            });
                        }
                    } else {
                        connectionPoints.push({
                            x: element.position.x,
                            y: element.position.y+gateConfig.height/2,
                            port: 0,
                            type: "input"
                        });
                    }
                    if(gateConfig.outputs) {
                        for(let i in gateConfig.outputs) {
                            const output = gateConfig.outputs[i];
                            connectionPoints.push({
                                x: element.position.x + gateConfig.width,
                                y: element.position.y + output.y,
                                port: Number(i),
                                type: "output"
                            });
                        }
                    }
                    if(connectionPoints.length === 0) continue;
                    const dist = (x1: number, y1: number) => x1 * x1 + y1 * y1;
                    connectionPoints.sort((a, b) => {
                        return dist(
                            a.x - nodeData.position.x,
                            a.y - nodeData.position.y
                        ) - dist(
                            b.x - nodeData.position.x,
                            b.y - nodeData.position.y
                        );
                    })
                    const connection = connectionPoints[0];
                    console.log(connection, connectionPoints, nodeData.position, box)
                    if(connection.type === "input") {
                        for(let wire of associatedWires) {
                            const from = wire.start;
                            const to = wire.end;
                            if(to === nodeID) {
                                editWire(wire.id, from, element.id, wire.startPort, connection.port);
                            } else if(from === nodeID) {
                                editWire(wire.id, to, element.id, wire.endPort, connection.port);
                            }
                        }
                    } else {
                        for(let wire of associatedWires) {
                            const from = wire.start;
                            const to = wire.end;
                            if(from === nodeID) {
                                editWire(wire.id, element.id, to, connection.port, wire.endPort);
                            } else if(to === nodeID) {
                                editWire(wire.id, element.id, from, connection.port, wire.startPort);
                            }
                        }

                    }
                }
            }
        }
    }

    function cleanUp(from: string) {
        checkOverlappingNodes(from);
        pruneLonelyNodes();
        convertNodeToGateConnection(from);
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

    const saveCircuit = useCallback(() => {
        return JSON.stringify({
            elements: elements,
            wires: wires
        });
    }, [elements, wires]);

    const loadCircuit = (data: string) => {
        const parsed = JSON.parse(data);
        setElements(parsed.elements);
        setWires(parsed.wires);
    }

    function createGate(type: GateType) {
        let uuid = crypto.randomUUID();
        const config = GateConfig[type];
        setElements((prev) => ({...prev, [uuid]: {
            position: snapPoint({x: -config.width / 2, y: -config.height / 2}),
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
        deleteElement,
        deleteWire,
        createGate,
        createLabel,
        cleanUp,
        saveCircuit,
        loadCircuit
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