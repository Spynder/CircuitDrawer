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
import { GateConfig, GateType } from './Constants';

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

const buttonClass = 'border-1 uppercase py-2 px-4 rounded not-disabled:cursor-pointer disabled:opacity-50';

function ElementCreatorButtons() {
    const { createGate, createLabel } = useElements();
    const [label, setLabel] = useState("");
    const { showGrid, setShowGrid, downloadImage } = useConfig();
    return (
      <div className='flex flex-col gap-2'>
        <h1 className='text-center mx-auto text-3xl'>Конструктор схем</h1>

        <h2 className='text-xl'>Добавить элементы:</h2>
        <div className='flex gap-4 p-4'>
          { Object.entries(GateConfig).map(([gate, _]) => (
            <button key={gate}
            className={buttonClass}
            onClick={() => createGate(gate as GateType)}>
              {gate}
            </button>
          ))}
          <div className='w-[2px] h-auto bg-white'/>
          <button onClick={() => createLabel(label)}
          disabled={label.length === 0}
          className={buttonClass}>
            Добавить надпись
          </button>
          <input type="text" value={label}
          onChange={(e) => setLabel(e.target.value)} className='border-1 border-white py-2 px-4'/>
        </div>

        <h2 className='text-xl'>Настройки:</h2>
        <div className='flex gap-4 p-4'>
          <button onClick={() => setShowGrid(!showGrid)}
          className={buttonClass}>
            {showGrid ? "Скрыть сетку" : "Показать сетку"}
          </button>
          
          <button onClick={downloadImage}
          className={buttonClass}>
            Скачать изображение
          </button>
        </div>
      </div>
    );
}