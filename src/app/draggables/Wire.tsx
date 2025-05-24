import { FederatedMouseEvent, Graphics } from "pixi.js";
import { useState } from "react";
import { snapPoint, useElements, useTransform } from "../contexts";
import { GateConfig, WIRE_WIDTH } from "../Constants";

interface WireProps {
    id: string;
}

export function Wire({
    id
}: Readonly<WireProps>) {
    const { elements, wires, addNewWire, createNode,
        editWire, moveElement, connectNewWire, deleteWire,
        cleanUp } = useElements();
    const { mouseToCanvas } = useTransform();
    const wire = wires[id];

    function draw(g: Graphics) {
        g.clear();
        const from = elements[wire.start];
        if(!from) {
            deleteWire(id);
            return;
        }
        let fromPosition = from.position;
        if(from.type === "gate") {
            const config = GateConfig[from.gateType!];
            fromPosition = {
                x: from.position.x + config.width,
                y: from.position.y + config.outputs[wire.startPort].y
            };
        }
        const to = elements[wire.end];
        if(!to) {
            deleteWire(id);
            return;
        }
        let toPosition = to.position;
        if(to.type === "gate") {
            const config = GateConfig[to.gateType!];
            if(config.inputs)
                toPosition = {
                    x: to.position.x,
                    y: to.position.y + config.inputs[wire.endPort].y
                };
            else {
                const connectedWires = Object.values(wires).filter(x => x.end === to.id);
                if(connectedWires.length === 1) {
                    toPosition = {
                        x: to.position.x,
                        y: to.position.y + config.height/2
                    };
                } else {
                    const startRange = config.height/2 - 10*(connectedWires.length-1)
                    const index = connectedWires.findIndex(x => x.id === wire.id);
                    toPosition = {
                        x: to.position.x,
                        y: to.position.y + startRange + 20*index
                    }
                }
            }
        }
        g.moveTo(fromPosition.x, fromPosition.y);
        g.lineTo(toPosition.x, toPosition.y);
        g.stroke({
            color: "#000000",
            width: WIRE_WIDTH
        });
    }

    const [isDragging, setIsDragging] = useState<"creating" | "moving" | false>(false);
    const [lastWire, setLastWire] = useState<{ start: string, end: string, id: string }>();
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

    const handlePointerDown = (e: FederatedMouseEvent) => {
        if(e.shiftKey) {
            setIsDragging("creating");
            let newNode = createNode(mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            }));
            editWire(id, wire.start, newNode);
            connectNewWire(newNode, wire.end);

            setLastWire(addNewWire(mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            }), newNode));
        } else {
            setIsDragging("moving");
            let local = mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            });
            setDragStart({
                x: -local.x,
                y: -local.y
            });
            setStartPoint(elements[wire.start].position);
            setEndPoint(elements[wire.end].position);
        }
        e.stopPropagation();
    };

    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
        if(isDragging === "creating") {
            moveElement(lastWire?.end!, 
                mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            }));
        } else if(isDragging === "moving") {
            let local = mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            });
            let currDelta = {
                x: dragStart.x + local.x,
                y: dragStart.y + local.y
            }
            moveElement(wire.start, {
                x: currDelta.x + startPoint.x,
                y: currDelta.y + startPoint.y
            })
            moveElement(wire.end, {
                x: currDelta.x + endPoint.x,
                y: currDelta.y + endPoint.y
            })
        }

        e.stopPropagation();
    };

    // Handle mouse up
    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        if(lastWire?.end)
            cleanUp(lastWire.end);
        if(lastWire?.start)
            cleanUp(lastWire.start);
        setIsDragging(false);
    };
    
    return (
        <pixiContainer>
            <pixiGraphics draw={draw}
            interactive
            cursor='grab'
            eventMode='static'
            onRightClick={() => deleteWire(id)}
            onPointerDown={handlePointerDown}
            onGlobalPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerUpOutside={handlePointerUp}
            />
        </pixiContainer>
    )
}