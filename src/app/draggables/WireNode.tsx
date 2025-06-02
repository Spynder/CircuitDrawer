import { useState } from "react";
import { Element } from "./Element";
import { FederatedMouseEvent, Graphics } from "pixi.js";
import { useElements } from "../contexts/ElementsContext";
import { useTransform } from "../contexts/TransformContext";
import { WIRE_WIDTH } from "../Constants";

export interface WireNodeProps {
    id: string;
}

export function WireNode({
    id
}: Readonly<WireNodeProps>) {
    const { elements, wires, addNewWire, moveElement, cleanUp, deleteElement } = useElements();
    const { position, mouseToCanvas } = useTransform();

    function draw(g: Graphics) {
        g.clear();
        const amount = Object.values(wires).filter(
            wire => wire.start === id || wire.end === id
        ).length;
        if(amount <= 2) {
            g.rect(-WIRE_WIDTH, -WIRE_WIDTH, WIRE_WIDTH*2, WIRE_WIDTH*2);
        } else {
            g.circle(0, 0, 5);
        }
        g.fill("#000");
        g.alpha = amount === 2 ? 0 : 1;
    }

    const [isDragging, setIsDragging] = useState(false);
    const [lastWire, setLastWire] = useState<{ start: string, end: string, id: string }>();

    const handlePointerDown = (e: FederatedMouseEvent) => {
        console.log("down")
        if(e.shiftKey) {
            setIsDragging(true);
            setLastWire(addNewWire(mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            }), id));
            e.stopPropagation();
        }
    };

    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
        moveElement(lastWire?.end!, mouseToCanvas({
            x: e.globalX,
            y: e.globalY
        }));

        e.stopPropagation();
    };

    // Handle mouse up
    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        const wire = wires[id];
        if(wire) {
            if(wire.start)
                cleanUp(wire.start);
            if(wire.end)
                cleanUp(wire.end);
        }
        if(lastWire?.start)
            cleanUp(lastWire.start);
        if(lastWire?.end)
            cleanUp(lastWire.end);
    };

	return (
		<Element position={elements[id].position} setPosition={(point) => moveElement(id, point)}>
			<pixiGraphics draw={draw}
            interactive
            cursor='grab'
            eventMode='static'
            onRightClick={() => deleteElement(id)}
            onPointerDown={handlePointerDown}
            onGlobalPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerUpOutside={handlePointerUp}
            />
		</Element>
	)
}
