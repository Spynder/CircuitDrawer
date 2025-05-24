import { useState } from "react";
import { GateConfig } from "../Constants";
import { useElements, WireParams } from "../contexts/ElementsContext";
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
        g.roundRect(0, 0, config.width, config.height, 5);
        g.fill("#ffffff");
        g.stroke({
            color: "#000000",
            width: STROKE_WIDTH
        });

        config.lines?.forEach(line => {
            g.moveTo(line.start.x, line.start.y);
            g.lineTo(line.end.x, line.end.y);
        });
        g.stroke({
            color: "#000000",
            width: STROKE_WIDTH
        });
    }

    const [isDragging, setIsDragging] = useState(false);
    const [lastWire, setLastWire] = useState<WireParams>();

    const handlePointerDown = (e: FederatedMouseEvent, index: number) => {
        if(e.shiftKey) {
            setIsDragging(true);
            setLastWire(addNewWire({
                x: e.globalX - position.x,
                y: e.globalY - position.y
            }, id, index));
            e.stopPropagation();
        }
    };

    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
        moveElement(lastWire?.end!, {
            x: e.globalX - position.x,
            y: e.globalY - position.y
        });

        //e.stopPropagation();
    };

    // Handle mouse up
    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        e.stopPropagation();
    };

    function drawInverted(g: Graphics, inverted: boolean) {
        g.clear();
        g.circle(0, 0, 7);
        g.fill("#ffffff");
        g.stroke({
            color: "#000000",
            width: STROKE_WIDTH
        });
        if(!inverted) g.alpha = 0;
    }

	return (
		<Element
        position={elements[id].position}
        setPosition={(point) => moveElement(id, point)}
        onRightClick={() => deleteElement(id)}
        >
			<pixiGraphics draw={draw} />
            {config.inputs?.map((input, index) => (
                <pixiGraphics
                    key={index}
                    x={0}
                    y={input.y}
                    draw={(g: Graphics) => {
                        drawInverted(g, input.inverted);
                    }}
                />
            ))}
            {config.outputs?.map((output, index) => (
                <pixiGraphics
                    key={index}
                    x={config.width}
                    y={output.y}
                    draw={(g: Graphics) => {
                        drawInverted(g, output.inverted);
                    }}
                    interactive
                    cursor='pointer'
                    eventMode='static'
                    onPointerDown={(e: FederatedMouseEvent) => handlePointerDown(e, index)}
                    onGlobalPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerUpOutside={handlePointerUp}
                />
            ))}
            {
                config.labels?.map((label) => (
                    <pixiText
                        key={label.label}
                        text={label.label}
                        style={{
                            fontSize: label.fontSize ?? 24
                        }}
                        anchor={label.anchor}
                        x={label.position.x}
                        y={label.position.y}
                    />
                ))
            }
        </Element>
	)
}
