import { FederatedMouseEvent } from "pixi.js";
import { useState, ReactNode } from "react";
import { GRID_SNAP } from "../Constants";

interface ElementProps {
	position: { x: number, y: number };
	setPosition: (position: { x: number, y: number }) => void;
	children?: ReactNode
	onRightClick?: () => void;
}

export function Element({
	position,
	setPosition,
	children,
	onRightClick
}: Readonly<ElementProps>) {
	const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });

	const handlePointerDown = (e: FederatedMouseEvent) => {
		if(e.shiftKey) return;
        setIsDragging(true);
        setStartPosition({
            x: position.x,
            y: position.y
        });
		setStartMousePosition({
			x: e.globalX,
			y: e.globalY
		});
		
        e.stopPropagation();
    };
    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
		const dx = e.globalX - startMousePosition.x;
		const dy = e.globalY - startMousePosition.y;
		const newPosition = {
			x: startPosition.x + dx,
			y: startPosition.y + dy
		};
		setPosition(newPosition);
        e.stopPropagation();
    };

    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        e.stopPropagation();
    };

	return (
		<pixiContainer
		x={position.x}
		y={position.y}
		eventMode='static'
		interactive
		cursor='pointer'
		onPointerDown={handlePointerDown}
		onGlobalPointerMove={handlePointerMove}
		onPointerUp={handlePointerUp}
		onPointerUpOutside={handlePointerUp}
		onRightClick={onRightClick}
		>
			{children}
		</pixiContainer>
	);
}