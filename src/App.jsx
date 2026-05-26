import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ASSET_PATHS = {
  introVideo: '/TimelessY2KVideo.mp4',
  wallpaper: '/TimelessY2KWallpaper.JPG',
  icons: '/icons/',
};

const desktopIcons = [
  {
    id: 'timeless',
    label: 'Timeless.exe',
    file: 'TimelessPopupICON.PNG',
    x: 7,
    y: 9,
    action: 'main',
  },
  {
    id: 'mp3',
    label: 'Y2K_Mix.mp3',
    file: 'mp3ICON.PNG',
    x: 22,
    y: 11,
    action: 'music',
  },
  {
    id: 'phone-open',
    label: 'RSVP.txt',
    file: 'nokiaOpenICON.PNG',
    x: 37,
    y: 10,
    action: 'text',
  },
  {
    id: 'money',
    label: 'Cover.zip',
    file: 'moneyBagICON.PNG',
    x: 52,
    y: 11,
    action: 'money',
  },
  {
    id: 'cup',
    label: 'Party_Mode',
    file: 'redSoloICON.PNG',
    x: 67,
    y: 10,
    action: 'party',
  },
  {
    id: 'lips',
    label: 'Kiss.gif',
    file: 'lipsICON.PNG',
    x: 82,
    y: 11,
    action: 'stamp',
  },
  {
    id: 'star',
    label: 'Star.exe',
    file: 'starICON.PNG',
    x: 11,
    y: 35,
    action: 'jump',
  },
  {
    id: 'sucker',
    label: 'Sweet.exe',
    file: 'suckerICON.PNG',
    x: 27,
    y: 36,
    action: 'pop',
  },
  {
    id: 'lips-sucker',
    label: 'Candy_Lips',
    file: 'lipsWsuckerICON.PNG',
    x: 44,
    y: 36,
    action: 'sweet',
  },
  {
    id: 'earrings',
    label: 'Ice.png',
    file: 'earingsICON.PNG',
    x: 61,
    y: 36,
    action: 'shine',
  },
  {
    id: 'chain',
    label: 'Links.url',
    file: 'goldLinkICON.PNG',
    x: 77,
    y: 36,
    action: 'links',
  },
  {
    id: 'phone-closed',
    label: 'Missed_Call',
    file: 'nokiaClosedICON.PNG',
    x: 15,
    y: 62,
    action: 'shake',
  },
];

const popupCopy = {
  main: {
    title: 'TLN Program Manager',
    heading: 'OVERLY 2000s',
    body: 'A retro Y2K party experience by TIMELESS No Limit LLC. Date, time, location, RSVP link, and ticket link go here.',
    buttons: ['RSVP', 'Tickets', 'Instagram'],
  },
  music: {
    title: 'Winamp 2000',
    heading: 'Y2K_Mix.mp3',
    body: 'Drop your intro song into /public/audio/intro-song.mp3. This player is wired for click-to-play browser-safe audio.',
    buttons: ['Play', 'Pause'],
  },
  text: {
    title: 'Nokia Message Center',
    heading: 'NEW TEXT MESSAGE',
    body: 'u outside? OVERLY 2000s is loading. Pull up in your best throwback fit.',
    buttons: ['Reply', 'Save'],
  },
  money: {
    title: 'Cover.zip',
    heading: 'VIP FILE FOUND',
    body: 'Ticket and cover info can live here. Add pricing, table info, Cash App, or Eventbrite link.',
    buttons: ['Open', 'Send'],
  },
  party: {
    title: 'Party_Mode.exe',
    heading: 'SYSTEM PARTY MODE ENABLED',
    body: 'Warning: nostalgia levels too high. Glitter, scanlines, and browser chaos activated.',
    buttons: ['OK'],
  },
  sweet: {
    title: 'Candy_Lips.exe',
    heading: 'SWEET ENTRY UNLOCKED',
    body: 'A hidden popup for promo codes, RSVP perks, or a secret message.',
    buttons: ['Claim'],
  },
  links: {
    title: 'Internet Explorer',
    heading: 'TIMELESS LINKS',
    body: 'Add Instagram, ticket, RSVP, and location links here. This can become a fake browser window.',
    buttons: ['Instagram', 'Tickets'],
  },
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function useSound() {
  const ctxRef = useRef(null);

  const beep = (type = 'click') => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = ctxRef.current || new AudioContext();
    ctxRef.current = ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = type === 'error' ? 160 : type === 'sparkle' ? 880 : type === 'warp' ? 440 : 520;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = type === 'error' ? 'square' : 'triangle';
    gain.gain.setValueAtTime(0.055, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  };

  return beep;
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [windows, setWindows] = useState([]);
  const [iconPositions, setIconPositions] = useState({});
  const [kisses, setKisses] = useState([]);
  const [partyMode, setPartyMode] = useState(false);
  const beep = useSound();

  useEffect(() => {
    const saved = localStorage.getItem('overly-icon-positions');
    if (saved) setIconPositions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (Object.keys(iconPositions).length) {
      localStorage.setItem('overly-icon-positions', JSON.stringify(iconPositions));
    }
  }, [iconPositions]);

  const icons = useMemo(() => desktopIcons.map((icon) => ({
    ...icon,
    ...(iconPositions[icon.id] || {}),
  })), [iconPositions]);

  const openWindow = (type, custom = {}) => {
    const copy = popupCopy[type] || popupCopy.main;
    setWindows((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        x: custom.x ?? randomBetween(13, 48),
        y: custom.y ?? randomBetween(12, 42),
        ...copy,
        ...custom,
      },
    ]);
  };

  const handleIconAction = (icon) => {
    beep(icon.action === 'shake' ? 'error' : icon.action === 'jump' ? 'sparkle' : 'click');

    if (['main', 'music', 'text', 'money', 'party', 'sweet', 'links'].includes(icon.action)) {
      openWindow(icon.action);
    }
    if (icon.action === 'party') setPartyMode((value) => !value);
    if (icon.action === 'stamp') {
      setKisses((prev) => [...prev, { id: Date.now(), x: randomBetween(12, 84), y: randomBetween(18, 68) }]);
    }
    if (icon.action === 'jump') {
      setIconPositions((prev) => ({ ...prev, [icon.id]: { x: randomBetween(4, 86), y: randomBetween(8, 69) } }));
    }
    if (icon.action === 'pop') {
      setIconPositions((prev) => ({ ...prev, [icon.id]: { x: randomBetween(6, 82), y: randomBetween(8, 70), popKey: Date.now() } }));
    }
    if (icon.action === 'shake') {
      openWindow('text', {
        title: 'ERROR 2000',
        heading: 'MISSED CALL FROM 2003',
        body: 'Your flip phone is vibrating. OVERLY.exe cannot be ignored.',
        buttons: ['Answer', 'Ignore'],
      });
    }
    if (icon.action === 'shine') {
      openWindow('party', {
        title: 'Ice Detector',
        heading: 'TOO MUCH DRIP DETECTED',
        body: 'System brightness has been increased by 2000%.',
        buttons: ['OK'],
      });
    }
  };

  if (!introDone) {
    return <IntroVideo onDone={() => setIntroDone(true)} />;
  }

  if (!started) {
    return <BootGate onStart={() => { setStarted(true); beep('warp'); }} />;
  }

  return (
    <main className={`site-shell ${partyMode ? 'party-mode' : ''}`}>
      <div className="desktop-frame">
        <div className="crt-overlay" />
        <div className="desktop-screen">
          <img className="wallpaper" src={ASSET_PATHS.wallpaper} alt="OVERLY 2000s wallpaper" />
          <div className="desktop-layer">
            {icons.map((icon) => (
              <DesktopIcon
                key={`${icon.id}-${icon.popKey || 0}`}
                icon={icon}
                onAction={() => handleIconAction(icon)}
                onMove={(position) => setIconPositions((prev) => ({ ...prev, [icon.id]: position }))}
              />
            ))}

            <AnimatePresence>
              {kisses.map((kiss) => (
                <motion.div
                  key={kiss.id}
                  className="kiss-stamp"
                  style={{ left: `${kiss.x}%`, top: `${kiss.y}%` }}
                  initial={{ scale: 0, rotate: -16, opacity: 0 }}
                  animate={{ scale: 1, rotate: 8, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >💋</motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {windows.map((window) => (
                <WindowPopup
                  key={window.id}
                  data={window}
                  onClose={() => setWindows((prev) => prev.filter((item) => item.id !== window.id))}
                />
              ))}
            </AnimatePresence>
          </div>
          <Taskbar onMain={() => openWindow('main')} onError={() => openWindow('party', {
            title: 'System Alert',
            heading: 'PARTY.EXE CANNOT BE STOPPED',
            body: 'The OVERLY timeline is already running.',
            buttons: ['OK'],
          })} />
        </div>
      </div>
    </main>
  );
}

function IntroVideo({ onDone }) {
  const [fallback, setFallback] = useState(false);
  return (
    <section className="intro-video-screen">
      <video
        className="intro-video"
        src={ASSET_PATHS.introVideo}
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        onError={() => setFallback(true)}
      />
      {fallback && (
        <button className="intro-skip" onClick={onDone}>ENTER TIMELESS ACCOUNT</button>
      )}
      <button className="skip-link" onClick={onDone}>skip intro</button>
    </section>
  );
}

function BootGate({ onStart }) {
  return (
    <section className="boot-gate">
      <motion.div className="title-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="small-title">TIMELESS NO LIMIT PRESENTS</div>
        <motion.h1 className="overly-title" initial={{ scale: 0.8, y: 18 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}>OVERLY</motion.h1>
        <motion.div className="year-title" initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.45 }}>2000s</motion.div>
        <p>Y2K desktop experience initialized. Click to enter the timeline.</p>
        <button className="enter-btn" onClick={onStart}>ENTER OVERLY.exe</button>
      </motion.div>
    </section>
  );
}

function DesktopIcon({ icon, onAction, onMove }) {
  const startRef = useRef(null);
  const dragRef = useRef(null);

  const onPointerDown = (event) => {
    dragRef.current = event.currentTarget;
    startRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: icon.x,
      y: icon.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!startRef.current) return;
    const dx = ((event.clientX - startRef.current.pointerX) / window.innerWidth) * 100;
    const dy = ((event.clientY - startRef.current.pointerY) / window.innerHeight) * 100;
    if (Math.abs(dx) + Math.abs(dy) > 0.8) startRef.current.moved = true;
    onMove({
      x: Math.max(1, Math.min(90, startRef.current.x + dx)),
      y: Math.max(5, Math.min(76, startRef.current.y + dy)),
    });
  };

  const onPointerUp = () => {
    const wasMoved = startRef.current?.moved;
    startRef.current = null;
    if (!wasMoved) onAction();
  };

  return (
    <motion.button
      className={`desktop-icon ${icon.action}`}
      style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      whileTap={{ scale: 0.92 }}
      animate={icon.action === 'shake' ? { x: [0, -2, 2, -1, 1, 0] } : {}}
      transition={{ repeat: icon.action === 'shake' ? Infinity : 0, repeatDelay: 4 }}
    >
      <img src={`${ASSET_PATHS.icons}${icon.file}`} alt="" draggable="false" />
      <span>{icon.label}</span>
    </motion.button>
  );
}

function WindowPopup({ data, onClose }) {
  return (
    <motion.div
      className={`window-popup ${data.type}`}
      style={{ left: `${data.x}%`, top: `${data.y}%` }}
      initial={{ opacity: 0, scale: 0.65, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      drag
      dragMomentum={false}
    >
      <div className="window-titlebar">
        <span>{data.title}</span>
        <div className="window-controls">
          <button>_</button><button>□</button><button onClick={onClose}>×</button>
        </div>
      </div>
      <div className="window-body">
        <h2>{data.heading}</h2>
        <p>{data.body}</p>
        <div className="window-buttons">
          {data.buttons?.map((button) => <button key={button}>{button}</button>)}
        </div>
      </div>
    </motion.div>
  );
}

function Taskbar({ onMain, onError }) {
  const now = new Date();
  return (
    <footer className="taskbar">
      <button className="start-button" onClick={onMain}>START</button>
      <button className="task-button" onClick={onMain}>OVERLY 2000s</button>
      <button className="task-button" onClick={onError}>Timeless.exe</button>
      <span className="task-spacer" />
      <span className="llc">TIMELESS No Limit LLC</span>
      <span className="clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </footer>
  );
}
