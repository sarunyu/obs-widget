export const ChromeDinoWidget = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative pointer-events-none">
      <style>
        {`
          @keyframes runDinoRun {
            0% { transform: translateX(-150px); }
            100% { transform: translateX(calc(100vw + 150px)); }
          }
          
          @keyframes dinoLegs {
            0% { background-position: -980px 0; }
            50% { background-position: -1024px 0; }
            100% { background-position: -980px 0; }
          }
          
          .dino-container {
            position: absolute;
            bottom: 60px;
            left: 0;
            animation: runDinoRun 12s linear infinite;
          }

          .dino-sprite {
            width: 44px;
            height: 47px;
            background-image: url('/assets/dino-sprite.png');
            background-repeat: no-repeat;
            /* Alternate between the two running frames */
            animation: dinoLegs 0.2s steps(1) infinite;
            transform: scale(2.5); /* Scale up to be visible on stream */
            image-rendering: pixelated; /* Keeps the retro pixel look sharp */
          }
        `}
      </style>
      
      <div className="dino-container">
        <div className="dino-sprite" />
      </div>
    </div>
  );
};
