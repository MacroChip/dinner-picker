import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  items: string[];
  label: string;
  onDone: (item?: string) => void;
};

export default function PrizeWheel({ items, label, onDone }: Props) {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const slice = items.length ? 360 / items.length : 0;

  const gradient = useMemo(() => {
    if (!items.length) return 'transparent';
    const slices = items
      .map((_, i) => {
        const start = slice * i;
        const end = slice * (i + 1);
        return `hsl(${(i * 360) / items.length},70%,70%) ${start}deg ${end}deg`;
      })
      .join(', ');
    return `conic-gradient(${slices})`;
  }, [items, slice]);

  useEffect(() => {
    if (!items.length) {
      onDone(undefined);
      return;
    }
    const idx = Math.floor(Math.random() * items.length);
    setSelectedIndex(idx);
    const finalRot = -(360 * 5 + slice * idx + slice / 2);
    setRotation(finalRot);
    const timer = setTimeout(() => onDone(items[idx]), 3000);
    return () => clearTimeout(timer);
  }, [items, slice, onDone]);

  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <h4>{label}</h4>
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #333',
            background: gradient,
            position: 'relative',
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: 'easeOut' }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `rotate(${slice * i}deg) translateY(-80px) rotate(-${slice * i}deg)`,
                transformOrigin: '0 0',
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              {it}
            </div>
          ))}
        </motion.div>
        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '20px solid red',
            }}
          ></div>
        </div>
      </div>
      {selectedIndex !== undefined && <p>{items[selectedIndex]}</p>}
    </div>
  );
}

