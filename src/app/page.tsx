"use client";

import {
  extend,
} from '@pixi/react';
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  TilingSprite,
  Text
} from 'pixi.js';

extend({
	Container,
	Graphics,
	Sprite,
	Texture,
	TilingSprite,
	Text
});

import { Redactor } from './editor';
import { useRef, useState } from 'react';
import { ConfigProvider, TransformProvider, ElementsProvider, useElements, useConfig } from './contexts';

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col min-h-screen p-8
    font-[family-name:var(--font-geist-sans)]"
    >

      <TransformProvider>
        <ElementsProvider>
          <ConfigProvider>
            <ElementCreatorButtons />
            <div className='w-full grow' onContextMenu={(e) => e.preventDefault()}
              ref={ref}>
              <Redactor resizeTo={ref}/>
            </div>
          </ConfigProvider>
        </ElementsProvider>
      </TransformProvider>
    </div>
  );
}


function ElementCreatorButtons() {
    const { createGate, createLabel } = useElements();
    const [label, setLabel] = useState("");
    const { showGrid, setShowGrid } = useConfig();
    return (
      <>
        <div className='flex gap-4 p-4 '>
          <button onClick={() => createGate("and")}>AND</button>
          <button onClick={() => createGate("nand")}>NAND</button>
          <button onClick={() => createGate("or")}>OR</button>
          <button onClick={() => createGate("nor")}>NOR</button>
          <button onClick={() => createGate("not")}>NOT</button>
          <button onClick={() => createLabel(label)}>Label</button>
          <input type="text" value={label}
          onChange={(e) => setLabel(e.target.value)} className='border-1 border-white py-2 px-4'/>
          <button onClick={() => setShowGrid(!showGrid)}>{showGrid ? "Hide Grid" : "Show Grid"}</button>
        </div>

      </>
    );
}