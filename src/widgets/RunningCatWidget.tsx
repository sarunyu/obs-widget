export const RunningCatWidget = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative pointer-events-none">
      <style>
        {`
          @keyframes runCatRun {
            0% { transform: translateX(-400px) scaleX(1); }
            45% { transform: translateX(calc(100vw + 400px)) scaleX(1); }
            50% { transform: translateX(calc(100vw + 400px)) scaleX(-1); }
            95% { transform: translateX(-400px) scaleX(-1); }
            100% { transform: translateX(-400px) scaleX(1); }
          }
          .cat-runner {
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 350px; /* Resize original large GIF */
            animation: runCatRun 16s linear infinite;
          }
        `}
      </style>
      
      <div className="cat-runner">
        <img src="/assets/nyan-cat.gif" alt="Nyan Cat" className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,105,180,0.4)]" />
      </div>
    </div>
  );
};
