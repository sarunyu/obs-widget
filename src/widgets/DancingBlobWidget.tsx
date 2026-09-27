export const DancingBlobWidget = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex justify-center items-center pointer-events-none">
      <style>
        {`
        :root {
            --blob-color: #ff7eb3;
            --blob-gradient: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
            --note-color: #ffb8d2;
            --headphone-color: #333;
            --bounce-speed: 0.45s;
        }

        .db-widget-container {
            position: relative;
            width: 250px;
            height: 250px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 50px;
        }

        .db-shadow {
            position: absolute;
            bottom: 30px;
            width: 100px;
            height: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            animation: db-shadow-pulse var(--bounce-speed) alternate infinite cubic-bezier(0.5, 0.05, 1, 0.5);
            z-index: 1;
        }

        @keyframes db-shadow-pulse {
            0% { transform: scale(1.2); opacity: 0.4; }
            100% { transform: scale(0.6); opacity: 0.1; }
        }

        .db-wrapper {
            position: relative;
            z-index: 2;
            animation: db-bounce var(--bounce-speed) alternate infinite cubic-bezier(0.5, 0.05, 1, 0.5);
        }

        .db-blob {
            width: 120px;
            height: 110px;
            background: var(--blob-gradient);
            border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%;
            box-shadow: 0 0 20px rgba(255, 126, 179, 0.4);
            position: relative;
            animation: db-morph 3s linear infinite;
        }

        @keyframes db-bounce {
            0% { transform: translateY(0) scale(1.05, 0.95); }
            100% { transform: translateY(-40px) scale(0.95, 1.05); }
        }

        @keyframes db-morph {
            0%, 100% { border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; }
            25% { border-radius: 55% 45% 50% 50% / 45% 55% 40% 60%; }
            50% { border-radius: 50% 50% 60% 40% / 60% 40% 55% 45%; }
            75% { border-radius: 40% 60% 45% 55% / 50% 50% 45% 55%; }
        }

        .db-face {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            gap: 25px;
        }

        .db-eye {
            width: 12px;
            height: 12px;
            background: #222;
            border-radius: 50%;
            animation: db-blink 4s infinite;
        }

        .db-blush {
            position: absolute;
            top: 15px;
            width: 18px;
            height: 8px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
        }

        .db-blush.left { left: 20px; }
        .db-blush.right { right: 20px; }

        @keyframes db-blink {
            0%, 46%, 48%, 100% { transform: scaleY(1); }
            47% { transform: scaleY(0.1); }
        }

        .db-headphones {
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 130px;
            height: 80px;
            border: 8px solid var(--headphone-color);
            border-bottom: none;
            border-radius: 70px 70px 0 0;
            z-index: 3;
            animation: db-head-bob var(--bounce-speed) alternate infinite cubic-bezier(0.5, 0.05, 1, 0.5);
        }

        .db-headphones::before, .db-headphones::after {
            content: '';
            position: absolute;
            bottom: -20px;
            width: 25px;
            height: 40px;
            background: var(--headphone-color);
            border-radius: 12px;
        }

        .db-headphones::before { left: -12px; }
        .db-headphones::after { right: -12px; }

        @keyframes db-head-bob {
            0% { transform: translateX(-50%) rotate(-3deg); }
            100% { transform: translateX(-50%) rotate(3deg); top: -10px; }
        }

        .db-arm {
            position: absolute;
            top: 55%;
            width: 20px;
            height: 35px;
            background: var(--blob-color);
            border-radius: 10px;
            z-index: 1;
        }

        .db-arm.left {
            left: -10px;
            transform-origin: top right;
            animation: db-swing-left var(--bounce-speed) alternate infinite ease-in-out;
        }

        .db-arm.right {
            right: -10px;
            transform-origin: top left;
            animation: db-swing-right var(--bounce-speed) alternate infinite ease-in-out;
        }

        @keyframes db-swing-left {
            0% { transform: rotate(20deg); }
            100% { transform: rotate(120deg) translateY(-10px); }
        }

        @keyframes db-swing-right {
            0% { transform: rotate(-20deg); }
            100% { transform: rotate(-120deg) translateY(-10px); }
        }

        .db-notes-container {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .db-note {
            position: absolute;
            color: var(--note-color);
            font-size: 24px;
            font-weight: bold;
            opacity: 0;
            text-shadow: 0 0 10px rgba(255, 184, 210, 0.8);
        }

        .db-note:nth-child(1) { left: 10%; bottom: 40%; animation: db-floatUp 2s linear infinite 0.1s; font-size: 28px; }
        .db-note:nth-child(2) { left: 80%; bottom: 30%; animation: db-floatUpRight 2.5s linear infinite 0.5s; font-size: 20px; }
        .db-note:nth-child(3) { left: 20%; bottom: 50%; animation: db-floatUpLeft 2.2s linear infinite 1.2s; font-size: 32px; }
        .db-note:nth-child(4) { left: 70%; bottom: 45%; animation: db-floatUp 2.8s linear infinite 1.8s; font-size: 24px; }
        .db-note:nth-child(5) { left: 45%; bottom: 30%; animation: db-floatUpRight 2.4s linear infinite 2.5s; font-size: 22px; }

        @keyframes db-floatUp {
            0% { transform: translateY(0) scale(0.8); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }

        @keyframes db-floatUpRight {
            0% { transform: translate(0, 0) rotate(0deg) scale(0.8); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(40px, -100px) rotate(20deg) scale(1.2); opacity: 0; }
        }

        @keyframes db-floatUpLeft {
            0% { transform: translate(0, 0) rotate(0deg) scale(0.8); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(-40px, -110px) rotate(-20deg) scale(1.1); opacity: 0; }
        }
        `}
      </style>

      <div className="db-widget-container">
          <div className="db-notes-container">
              <div className="db-note">♪</div>
              <div className="db-note">♫</div>
              <div className="db-note">♪</div>
              <div className="db-note">♬</div>
              <div className="db-note">♫</div>
          </div>

          <div className="db-wrapper">
              <div className="db-headphones"></div>
              <div className="db-blob">
                  <div className="db-arm left"></div>
                  <div className="db-arm right"></div>
                  <div className="db-face">
                      <div className="db-eye"></div>
                      <div className="db-eye"></div>
                      <div className="db-blush left"></div>
                      <div className="db-blush right"></div>
                  </div>
              </div>
          </div>
          
          <div className="db-shadow"></div>
      </div>
    </div>
  );
};
