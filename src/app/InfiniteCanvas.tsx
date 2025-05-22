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
    FederatedMouseEvent
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
    const { position, setPosition, mouseToCanvas } = useTransform();
    const { showGrid, setApp, setContainerFrame } = useConfig();
    const { addNewWire, moveElement, elements, wires, checkOverlappingNodes } = useElements();
    const [isDragging, setIsDragging] = useState<"wire" | "drag" | false>(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastWire, setLastWire] = useState<{id: string, start: string, end: string}>();
    const applicationRef = useRef<ApplicationRef>(null);

    useEffect(() => {
        setApp(applicationRef.current);
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
            x: -local.x,
            y: -local.y
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
            checkOverlappingNodes(lastWire.start);
        if(lastWire?.end)
            checkOverlappingNodes(lastWire.end);
        e.stopPropagation();
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
                    tint={showGrid ? "#ccc" : "#fff"}
                    
                    eventMode={'static'}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
					onPointerUpOutside={handlePointerUp}
                />
            }
            <pixiContainer x={position.x} y={position.y} key='fjdfjsdjfdsk' ref={setContainerFrame}>
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