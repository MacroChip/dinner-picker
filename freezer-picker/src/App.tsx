import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Category = 'meat' | 'vegetable' | 'carb';

type Item = {
  name: string;
  category?: Category;
};

export default function App() {
  const [rawInput, setRawInput] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<{ meat?: string; vegetable?: string; carb?: string }>({});

  const loadItems = () => {
    const lines = rawInput
      .split(/[\n,]/)
      .map((l) => l.trim())
      .filter(Boolean);
    setItems(lines.map((name) => ({ name } as Item)));
  };

  const handleAssign = (index: number, category: Category) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, category } : it)));
  };

  const randomize = () => {
    const meats = items.filter((i) => i.category === 'meat');
    const vegetables = items.filter((i) => i.category === 'vegetable');
    const carbs = items.filter((i) => i.category === 'carb');
    setSelected({
      meat: meats[Math.floor(Math.random() * meats.length)]?.name,
      vegetable: vegetables[Math.floor(Math.random() * vegetables.length)]?.name,
      carb: carbs[Math.floor(Math.random() * carbs.length)]?.name,
    });
  };

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
          <h2>Items</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name}{' '}
                <select
                  value={item.category ?? ''}
                  onChange={(e) => handleAssign(index, e.target.value as Category)}
                >
                  <option value="">Uncategorized</option>
                  <option value="meat">Meat</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="carb">Carb</option>
                </select>
              </li>
            ))}
          </ul>
          <button onClick={randomize}>Pick Dinner</button>
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
