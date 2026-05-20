"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        <span className="block mb-4 text-xs md:text-sm text-primary font-medium">
          Life Outside the Terminal
        </span>
        <h3 className="text-4xl md:text-6xl font-semibold text-foreground">
          Choreography, Crafts & Creativity
        </h3>
        <p className="text-base md:text-lg text-muted-foreground my-4 md:my-6">
          When I'm not designing secure network configurations or debugging interfaces, I'm building real-world communities. You'll find me choreographing group dances, coordinating craft exhibitions, and crafting digital art.
        </p>
        <button className={cn(
          "bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md",
          "transition-all hover:bg-primary/90 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}>
          Explore My Creations
        </button>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "final-ipad.png",
  },
  {
    id: 2,
    src: "laedooba.png",
  },
  {
    id: 3,
    src: "MEHUL CHOREO OWNER.png",
  },
  {
    id: 4,
    src: "visual proj 1 .png",
  },
  {
    id: 5,
    src: "visual proj 2 .png",
  },
  {
    id: 6,
    src: "visual proj 3.png",
  },
  {
    id: 7,
    src: "visual proj 4.png",
  },
  {
    id: 8,
    src: "SKILLO OWNER MRUDULA.png",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1521537634581-175653b6f04f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1592656094270-b852951cc4c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
  },
];

const generateSquares = () => {
  return shuffle([...squareData]).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-md overflow-hidden bg-muted"
      style={{
        backgroundImage: `url('${sq.src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setSquares(generateSquares());
    
    const shuffleSquares = () => {
      setSquares(generateSquares());
      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };

    timeoutRef.current = setTimeout(shuffleSquares, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares}
    </div>
  );
};
