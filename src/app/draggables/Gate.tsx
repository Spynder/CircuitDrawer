import { useState } from "react";
import { GateConfig } from "../Constants";
import { useElements } from "../contexts/ElementsContext";
import { Element } from "./Element";
import { FederatedMouseEvent, Graphics } from "pixi.js";
import { useTransform } from "../contexts";

export interface GateProps {
    id: string;
}

const STROKE_WIDTH = 2;

export function Gate({
    id
}: Readonly<GateProps>) {
    const { elements, moveElement, deleteElement, addNewWire } = useElements();
    const { position } = useTransform();
    const config = GateConfig[elements[id].gateType!];

    
    function draw(g: Graphics) {
        g.clear();
        g.roundRect(0, 0, 50, 100, 5);
        g.fill("#ffffff");
        g.stroke({
            color: "#000000",
            width: STROKE_WIDTH
        });
    }

    const [isDragging, setIsDragging] = useState(false);
    const [lastWire, setLastWire] = useState<{ start: string, end: string, id: string }>();

    const handlePointerDown = (e: FederatedMouseEvent) => {
        console.log("CLICK")
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
        e.stopPropagation();
    };

	return (
		<Element
        position={elements[id].position}
        setPosition={(point) => moveElement(id, point)}
        onRightClick={() => deleteElement(id)}
        >
			<pixiGraphics draw={draw} />
            <pixiGraphics
                x={50}
                y={50}
                draw={(g: Graphics) => {
                    g.clear();
                    g.circle(0, 0, 10);
                    
                    g.fill("#ffffff");
                    g.stroke({
                        color: "#000000",
                        width: STROKE_WIDTH
                    });
                    if(!config.inverted) g.alpha = 0;
                }}
                interactive
                cursor='pointer'
                eventMode='static'
                onPointerDown={handlePointerDown}
                onGlobalPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerUpOutside={handlePointerUp}
            />
            <pixiText text={config.label} anchor={{x: 1, y: 0}} x={45} y={5}/>
            <pixiText text={(config.inputs ?? "").split("").join('\n')} anchor={{x: 0, y: 0}} x={5} y={5} style={{lineHeight: 20, fontSize: 18}}/>
            <pixiText text={(config.outputs ?? "").split("").join('\n')} anchor={{x: 1, y: 0}} x={45} y={5} style={{lineHeight: 20, fontSize: 18}}/>
		</Element>
	)
}
