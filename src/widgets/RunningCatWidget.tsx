
export const RunningCatWidget = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative pointer-events-none">
      <style>
        {`
          @keyframes runCatRun {
            0% { transform: translateX(-200px) scaleX(1); }
            45% { transform: translateX(calc(100vw + 100px)) scaleX(1); }
            50% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
            95% { transform: translateX(-200px) scaleX(-1); }
            100% { transform: translateX(-200px) scaleX(1); }
          }
          .cat-runner {
            position: absolute;
            bottom: 20px;
            left: 0;
            font-size: 5rem;
            animation: runCatRun 12s linear infinite;
            filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.5));
          }
          
          /* Bobbing animation to make it look like it's running */
          @keyframes bobbing {
            0%, 100% { padding-bottom: 0px; }
            50% { padding-bottom: 15px; }
          }
          .cat-body {
            display: inline-block;
            animation: bobbing 0.2s alternate infinite;
          }
        `}
      </style>
      
      <div className="cat-runner">
        <div className="cat-body">
          🐈
        </div>
      </div>
    </div>
  );
};
