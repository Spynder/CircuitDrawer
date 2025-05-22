import { extend } from '@pixi/react';
import { InfiniteCanvas } from './InfiniteCanvas';
import {
	Container,
	Graphics,
	Sprite,
	Texture,
	TilingSprite,
} from 'pixi.js';
import { RefObject, useState } from 'react';
import { Gate, GateProps } from './draggables/Gate';
import { Wire } from './draggables/Wire';
import { TransformProvider } from './contexts/TransformContext';
import { WireNode } from './draggables/WireNode';
import { GRID_SNAP } from './Constants';
import { ElementsProvider } from './contexts/ElementsContext';

extend({
	Container,
	Graphics,
	Sprite,
	Texture,
	TilingSprite
});

// Main component
export function Redactor({resizeTo}: Readonly<{resizeTo: RefObject<HTMLElement | null>}>) {
	return (
        <InfiniteCanvas resizeTo={resizeTo} />
	);
}

