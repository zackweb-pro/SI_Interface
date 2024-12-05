import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NeonBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update dimensions when the window resizes
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions and add event listener
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 via-purple-800 to-blue-600 opacity-30 filter blur-3xl"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
          }}
          initial={{
            scale: 0,
            x: Math.random() * dimensions.width - 200,
            y: Math.random() * dimensions.height - 200,
          }}
          animate={{
            scale: [1, 1.5, 1],
            x: [
              Math.random() * dimensions.width - 200,
              Math.random() * dimensions.width - 200,
            ],
            y: [
              Math.random() * dimensions.height - 200,
              Math.random() * dimensions.height - 200,
            ],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6 + index * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default NeonBackground;
