import { FederatedMouseEvent, Graphics } from "pixi.js";
import { useState } from "react";
import { useElements, useTransform } from "../contexts";
import { WIRE_WIDTH } from "../Constants";

interface WireProps {
    id: string;
}

export function Wire({
    id
}: Readonly<WireProps>) {
    const { elements, wires, addNewWire, createNode,
        editWire, moveElement, connectNewWire, deleteWire,
        checkOverlappingNodes } = useElements();
    const { mouseToCanvas } = useTransform();
    const wire = wires[id];

    function draw(g: Graphics) {
        g.clear();
        const from = elements[wire.start];
        let fromPosition = from.position;
        if(from.type === "gate") {
            fromPosition = {
                x: from.position.x + 50,
                y: from.position.y + 50
            };
        }
        const to = elements[wire.end];
        g.moveTo(fromPosition.x, fromPosition.y);
        g.lineTo(to.position.x, to.position.y);
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
            checkOverlappingNodes(lastWire.end);
        e.stopPropagation();
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