import {
    Application,
    ApplicationRef,
    extend
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
    Assets,
    Texture,
    TilingSprite,
    FederatedMouseEvent,
    FederatedWheelEvent
} from 'pixi.js';
import {
    ReactNode,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTransform } from './contexts/TransformContext';
import { useElements } from './contexts/ElementsContext';
import { Wire } from './draggables/Wire';
import { Gate } from './draggables/Gate';
import { WireNode } from './draggables/WireNode';
import { Label } from './draggables/Label';
import { useConfig } from './contexts';

extend({
    Container,
    Graphics,
    Sprite,
    Texture,
    TilingSprite
});

interface InfiniteCanvasProps {
    resizeTo?: RefObject<HTMLElement | null>;
}


export function InfiniteCanvas({
    resizeTo
} : Readonly<InfiniteCanvasProps>) {
    const { position, setPosition, scale, setScale, mouseToCanvas } = useTransform();
    const { showGrid, setApp, setContainerFrame } = useConfig();
    const { addNewWire, moveElement, elements, wires, cleanUp, setElementsApp } = useElements();
    const [isDragging, setIsDragging] = useState<"wire" | "drag" | false>(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastWire, setLastWire] = useState<{id: string, start: string, end: string}>();
    const applicationRef = useRef<ApplicationRef>(null);

    useEffect(() => {
        setApp(applicationRef.current);
        setElementsApp(applicationRef.current);
    }, [applicationRef]);

    const handlePointerDown = (e: FederatedMouseEvent) => {
        setIsDragging(e.shiftKey ? "wire" : "drag");
        if(e.shiftKey) {
            setLastWire(addNewWire(mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            })));
        }
        const local = mouseToCanvas({
            x: e.globalX,
            y: e.globalY
        });
        setDragStart({
            x: -local.x*scale,
            y: -local.y*scale
        });
        e.stopPropagation();
    };

    const handlePointerMove = (e: FederatedMouseEvent) => {
        if (!isDragging) return;
        if(isDragging === "drag") {
            setPosition({
                x: dragStart.x + e.globalX,
                y: dragStart.y + e.globalY
            });
        } else if(isDragging === "wire") {
            moveElement(lastWire?.end!, mouseToCanvas({
                x: e.globalX,
                y: e.globalY
            }));
        }

        e.stopPropagation();
    };

    // Handle mouse up
    const handlePointerUp = (e: FederatedMouseEvent) => {
        setIsDragging(false);
        if(lastWire?.start)
            cleanUp(lastWire.start);
        if(lastWire?.end)
            cleanUp(lastWire.end);
    };

    const handleWheel = (e: FederatedWheelEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Get mouse position relative to canvas
        const mouseX = e.globalX - position.x;
        const mouseY = e.globalY - position.y;

        // Calculate new scale
        const scaleMin = 0.2;
        const scaleMax = 5;

        let zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out/in
        //const newScale = scale * zoomFactor;
        const newScale = Math.max(scaleMin, Math.min(scaleMax, scale * zoomFactor));
        zoomFactor = newScale / scale;

        if (scale === newScale) {
            return;
        }

        // Update position to zoom towards mouse cursor
        setPosition({
            x: position.x + mouseX * (1 - zoomFactor),
            y: position.y + mouseY * (1 - zoomFactor)
        });

        setScale(newScale);
    };

    const [texture, setTexture] = useState(Texture.EMPTY)

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets
                .load('/grid.png')
                .then((result: Texture) => {
                    setTexture(result)
                });
        }
    }, [texture]);

    return (
        <Application
        ref={applicationRef}
        resizeTo={resizeTo}
        background='#fff'
        className='rounded'
        >
            {applicationRef.current && 
                <pixiTilingSprite
                    texture={texture}
                    width={applicationRef.current.getCanvas()?.width}
                    height={applicationRef.current.getCanvas()?.height}
                    tilePosition={{
                        x: position.x,
                        y: position.y
                    }}
                    tileScale={{
                        x: scale,
                        y: scale
                    }}
                    tint={showGrid ? "#ccc" : "#fff"}
                    
                    eventMode={'static'}
                    onPointerDown={handlePointerDown}
                    onGlobalPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
					onPointerUpOutside={handlePointerUp}
					onWheel={handleWheel}
                />
            }
            <pixiGraphics x={position.x} y={position.y} scale={scale} draw={(g: Graphics) => {
                g.clear();
                g.circle(0, 0, 8);
                g.fill("ccc");
            }} />
            <pixiContainer x={position.x} y={position.y} scale={scale} ref={setContainerFrame}>
                {
                    Object.values(wires).map((wire) => (
                        <Wire key={wire.id} id={wire.id} />
                    ))
                }
                {
                    Object.values(elements).map((element) => (
                        <pixiContainer key={element.id}>
                            {element.type === "node" && (
                                <WireNode id={element.id} />
                            )}
                            {element.type === "gate" && (
                                <Gate id={element.id} />
                            )}
                            {element.type === "label" && (
                                <Label id={element.id} />
                            )}
                        </pixiContainer>
                    ))
                }
            </pixiContainer>

        </Application>
    );
}