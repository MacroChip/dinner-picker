import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PrizeWheel from './PrizeWheel';

type Category = 'meat' | 'vegetable' | 'carb';

type Item = {
  name: string;
  category?: Category;
};

export default function App() {
  const [rawInput, setRawInput] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<{ meat?: string; vegetable?: string; carb?: string }>({});
  const [spinKey, setSpinKey] = useState(0);

  const loadItems = () => {
    const lines = rawInput
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter(Boolean);
    setItems(lines.map((name) => ({ name } as Item)));
  };

  const handleDragStart = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (category: Category | undefined) => (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const index = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(index)) return;
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, category } : it))
    );
  };

  const randomize = () => {
    setSelected({});
    setSpinKey((k) => k + 1);
  };

  const meats = items.filter((i) => i.category === 'meat');
  const vegetables = items.filter((i) => i.category === 'vegetable');
  const carbs = items.filter((i) => i.category === 'carb');

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Freezer Picker</h1>
      <textarea
        rows={5}
        style={{ width: '100%', maxWidth: 400 }}
        placeholder="Enter items separated by commas or new lines"
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
      />
      <div>
        <button onClick={loadItems}>Load Items</button>
      </div>
      {items.length > 0 && (
        <div>
          <h2>Drag items into categories</h2>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            {(() => {
              const catItems: Record<string, [Item, number][]> = {
                none: [],
                meat: [],
                vegetable: [],
                carb: [],
              };
              items.forEach((it, i) => {
                catItems[it.category ?? 'none'].push([it, i]);
              });
              const cats = [
                { key: 'none', label: 'Uncategorized', value: undefined as Category | undefined },
                { key: 'meat', label: 'Meat', value: 'meat' as Category },
                { key: 'vegetable', label: 'Vegetable', value: 'vegetable' as Category },
                { key: 'carb', label: 'Carb', value: 'carb' as Category },
              ];
              return cats.map((c) => (
                <div
                  key={c.key}
                  onDrop={handleDrop(c.value)}
                  onDragOver={(e) => e.preventDefault()}
                  style={{ border: '1px solid #ccc', padding: 10, minWidth: 150 }}
                >
                  <h3>{c.label}</h3>
                  {catItems[c.key].map(([it, i]) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={handleDragStart(i)}
                      style={{ margin: '4px 0', padding: '4px', border: '1px solid #ddd' }}
                    >
                      {it.name}
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
          <button onClick={randomize}>Pick Dinner</button>
        </div>
      )}
      {spinKey > 0 && (
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <PrizeWheel
            key={`meat-${spinKey}`}
            items={meats.map((m) => m.name)}
            label="Meat"
            onDone={(it) => setSelected((p) => ({ ...p, meat: it }))}
          />
          <PrizeWheel
            key={`veg-${spinKey}`}
            items={vegetables.map((v) => v.name)}
            label="Vegetable"
            onDone={(it) => setSelected((p) => ({ ...p, vegetable: it }))}
          />
          <PrizeWheel
            key={`carb-${spinKey}`}
            items={carbs.map((c) => c.name)}
            label="Carb"
            onDone={(it) => setSelected((p) => ({ ...p, carb: it }))}
          />
        </div>
      )}
      {selected.meat && selected.vegetable && selected.carb && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2>Your Dinner</h2>
          <p>
            Meat: {selected.meat} <br />
            Vegetable: {selected.vegetable} <br />
            Carb: {selected.carb}
          </p>
        </motion.div>
      )}
    </div>
  );
}
