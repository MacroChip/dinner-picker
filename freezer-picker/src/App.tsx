import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';

const knownMeats = ['chicken', 'beef', 'pork', 'turkey', 'fish'];
const knownVegetables = ['broccoli', 'carrot', 'peas', 'spinach', 'corn'];
const knownCarbs = ['rice', 'pasta', 'bread', 'potato'];

type Category = 'meat' | 'vegetable' | 'carb';

type Item = {
  name: string;
  category?: Category;
};

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ meat?: string; vegetable?: string; carb?: string }>({});

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const worker = await createWorker('eng');
    const {
      data: { text },
    } = await worker.recognize(e.target.files[0]);
    await worker.terminate();

    const lines = text
      .split(/\n|,/) // split by newline or comma
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);

    const parsedItems = lines.map<Item>((name) => ({ name }));
    setItems(parsedItems);
    setLoading(false);
  };

  const autoCategorize = (item: Item): Category | undefined => {
    const name = item.name.toLowerCase();
    if (knownMeats.some((m) => name.includes(m))) return 'meat';
    if (knownVegetables.some((v) => name.includes(v))) return 'vegetable';
    if (knownCarbs.some((c) => name.includes(c))) return 'carb';
    return undefined;
  };

  const handleAssign = (index: number, category: Category) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, category } : it)));
  };

  const randomize = () => {
    const meats = items.filter((i) => (i.category ?? autoCategorize(i)) === 'meat');
    const vegetables = items.filter((i) => (i.category ?? autoCategorize(i)) === 'vegetable');
    const carbs = items.filter((i) => (i.category ?? autoCategorize(i)) === 'carb');
    setSelected({
      meat: meats[Math.floor(Math.random() * meats.length)]?.name,
      vegetable: vegetables[Math.floor(Math.random() * vegetables.length)]?.name,
      carb: carbs[Math.floor(Math.random() * carbs.length)]?.name,
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Freezer Picker</h1>
      <input type="file" accept="image/*" onChange={handleImage} />
      {loading && <p>Processing image...</p>}
      {items.length > 0 && (
        <div>
          <h2>Items</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name}{' '}
                <select
                  value={item.category ?? autoCategorize(item) ?? ''}
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
