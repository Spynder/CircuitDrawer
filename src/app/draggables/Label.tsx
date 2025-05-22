import { useElements } from "../contexts/ElementsContext";
import { Element } from "./Element";
import { Graphics } from "pixi.js";

export interface LabelProps  {
    id: string;
}

const STROKE_WIDTH = 2;

export function Label({
    id
}: Readonly<LabelProps>) {
    const { elements, moveElement, deleteElement } = useElements();
    const label = elements[id].label;
    
    function draw(g: Graphics) {
        g.clear();
        g.roundRect(0, 0, 50, 100, 10);
        g.fill("#ffffff");
        g.stroke({
            color: "#000000",
            width: STROKE_WIDTH
        });
    }

    return (
        <Element
        position={elements[id].position}
        setPosition={(point) => moveElement(id, point)}
        onRightClick={() => deleteElement(id)}
        >
            <pixiText text={label} anchor={0.5}/>
        </Element>
    )
}
