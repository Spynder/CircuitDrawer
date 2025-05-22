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
    const { elements, wires, addNewWire, moveElement, checkOverlappingNodes, deleteElement } = useElements();
    const { position } = useTransform();

    function draw(g: Graphics) {
        g.clear();
        let amount = Object.values(wires).filter(
            wire => wire.start === id || wire.end === id).length;
        if(amount <= 2) {
            g.rect(-WIRE_WIDTH, -WIRE_WIDTH, WIRE_WIDTH*2, WIRE_WIDTH*2);
        } else {
            g.circle(0, 0, 5);
        }
        g.fill("#000");
        if(amount === 2) g.alpha = 0;
    }

    const [isDragging, setIsDragging] = useState(false);
    const [lastWire, setLastWire] = useState<{ start: string, end: string, id: string }>();

    const handlePointerDown = (e: FederatedMouseEvent) => {
        console.log("down")
        if(e.shiftKey) {
            setIsDragging(true);
            setLastWire(addNewWire({
                x: e.globalX - position.x,
                y: e.globalY - position.y
            }, id));
            e.stopPropagation();
        }
    };

    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
        moveElement(lastWire?.end!, {
            x: e.globalX - position.x,
            y: e.globalY - position.y
        });

        e.stopPropagation();
    };

    // Handle mouse up
    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        checkOverlappingNodes(id);
        if(lastWire?.start)
            checkOverlappingNodes(lastWire.start);
        if(lastWire?.end)
            checkOverlappingNodes(lastWire.end);
        e.stopPropagation();
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
