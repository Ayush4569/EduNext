import Confetti from "react-confetti";
import { useState, useEffect } from "react";

const ConfettiComponent = () => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  return showConfetti ?  <Confetti width={window.innerWidth} height={window.innerHeight} /> : null
};

export default ConfettiComponent;