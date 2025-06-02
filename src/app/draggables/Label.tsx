import { useElements } from "../contexts/ElementsContext";
import { Element } from "./Element";

import {
  extend,
} from '@pixi/react';
import {
    HTMLText
} from 'pixi.js';
import { type UnprefixedPixiElements } from '@pixi/react'

extend({
    HTMLText
});

export interface LabelProps  {
    id: string;
}

const STROKE_WIDTH = 2;

export function Label({
    id
}: Readonly<LabelProps>) {
    const { elements, moveElement, deleteElement } = useElements();
    const label = elements[id].label;

    return (
        <Element
        position={elements[id].position}
        setPosition={(point) => moveElement(id, point)}
        onRightClick={() => deleteElement(id)}
        >
            {/* @ts-ignore */}
            <pixiHTMLText text={label} anchor={0.5}/>
        </Element>
    )
}
