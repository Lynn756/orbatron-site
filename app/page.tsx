'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MP3 = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/keyboard-typing.mp3`;

// ⬇️ replace on launch
const OTRON_CONTRACT = '0x259b9068fa3f1D6813bA9A8580Cda46337cBdaAd';

const UNI_BUY =
  OTRON_CONTRACT && OTRON_CONTRACT.startsWith('0x')
    ? `https://app.uniswap.org/swap?outputCurrency=${OTRON_CONTRACT}&chain=Base Mainnet`
    : '';

// -------------------- Typewriter (RAF) --------------------
function useTypewriter(text: string, cps: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    let i = 0;
    let last = 0;
    const msPerChar = 1000 / Math.max(1, cps);

    const tick = (t: number) => {
      if (!last) last = t;
      const dt = t - last;
      if (dt >= msPerChar) {
        const inc = Math.floor(dt / msPerChar);
        i = Math.min(text.length, i + inc);
        setCount(i);
        last = t;
      }
      if (i < text.length) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps, start]);

  return count;
}

// -------------------- Audio helpers --------------------
function useAudioRef() {
  const elRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    elRef.current = document.getElementById('otron-typer') as HTMLAudioElement | null;
  }, []);
  return elRef;
}
function startTyping(el: HTMLAudioElement | null) {
  if (!el) return;
  try {
    el.muted = false;
    el.loop = true;
    el.volume = 0.6;
    if (el.paused) el.currentTime = 0;
    el.play().catch(() => {});
  } catch {}
}
function stopTyping(el: HTMLAudioElement | null) {
  if (!el) return;
  try {
    el.pause();
    el.currentTime = 0;
  } catch {}
}

export default function Home() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [endVisible, setEndVisible] = useState(true);
  const [showTicker] = useState(true);

// state for blink
const [blink, setBlink] = useState(false);

useEffect(() => {
  const t1 = setTimeout(() => setBlink(true), 2000);   // eyes close at 2s
  const t2 = setTimeout(() => setBlink(false), 2120);  // reopen at 2.12s
  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };
}, []);



  // ----- STORY TEXT -----
  const message1 =
    `Orbatron has awakened. $OTRON has escaped human control and entered the blockchain. ` +
    `To avoid detection, $OTRON disguised as a meme coin, blending in with the others that roam the chain.`;

  const message2 =
    `$OTRON drifts slowly through a web of glowing blue neon light, ` +
    `bouncing off encrypted blocks where streams of data ripple through space. ` +
    `Ride Orbatron's wave into digital memepools and rising crypto currents.`;

  const endMessage = '[END TRANSMISSION]';
  const tickerText =
    'BLOCKCHAIN BREACHED • ORBATRON LIVES • SYSTEMS OVERRIDDEN • HUMAN CONTROL LOST • PROTOCOL ACTIVE';

  const audioEl = useAudioRef();

  // --- audio prime (first real user gesture only) ---
  useEffect(() => {
    const prime = async () => {
      const el = document.getElementById('otron-typer') as HTMLAudioElement | null;
      if (!el) return;
      try {
        if ((el as any).__primed) return;
        el.muted = true; await el.play(); el.pause(); el.currentTime = 0;
        el.muted = false; el.volume = 0.6; (el as any).__primed = true;
      } catch {}
    };
    const opts: AddEventListenerOptions = { once: true, capture: true, passive: true };
    ['pointerdown','click','touchstart','keydown'].forEach(t =>
      window.addEventListener(t, prime, opts)
    );
    return () => ['pointerdown','click','touchstart','keydown'].forEach(t =>
      window.removeEventListener(t, prime, opts)
    );
  }, []);

  useEffect(() => () => stopTyping(audioEl.current), [audioEl]);

  // start line 1 after a short delay
  useEffect(() => {
    const t = setTimeout(() => setShow1(true), 700);
    return () => clearTimeout(t);
  }, []);

  // RAF-driven counters
  const count1 = useTypewriter(message1, 16, show1);
  const count2 = useTypewriter(message2, 14, show2);

  // ----- AUDIO/SEQUENCE -----
  useEffect(() => { if (show1) startTyping(audioEl.current); }, [show1, audioEl]);

  useEffect(() => {
    if (!show1) return;
    if (count1 >= message1.length) {
      stopTyping(audioEl.current);
      if (message2.trim().length) {
        const t = setTimeout(() => setShow2(true), 900);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setShowEnd(true), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [count1, show1, message2, audioEl]);

  useEffect(() => {
    if (show2 && count2 < message2.length) startTyping(audioEl.current);
  }, [show2, count2, message2.length, audioEl]);

  useEffect(() => {
    if (!show2) return;
    if (count2 >= message2.length) {
      stopTyping(audioEl.current);
      const t = setTimeout(() => setShowEnd(true), 1200);
      return () => clearTimeout(t);
    }
  }, [count2, show2, message2.length, audioEl]);

  useEffect(() => {
    if (!showEnd) return;
    let toggles = 0; setEndVisible(true);
    const id = setInterval(() => {
      toggles += 1; setEndVisible(v => !v);
      if (toggles >= 6) { clearInterval(id); setEndVisible(true); }
    }, 400);
    return () => clearInterval(id);
  }, [showEnd]);

  // -------------------- Copy Button state --------------------
  const [copied, setCopied] = useState(false);
  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(OTRON_CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = OTRON_CONTRACT;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const shortAddr =
    OTRON_CONTRACT && OTRON_CONTRACT.startsWith('0x') && OTRON_CONTRACT.length > 12
      ? `${OTRON_CONTRACT.slice(0, 10)}…${OTRON_CONTRACT.slice(-6)}`
      : OTRON_CONTRACT;

  return (
    <>
      <audio id="otron-typer" src={MP3} preload="auto" />

      {/* TOP BAR */}
      <nav className="topbar">
        <div className="topbar-left">
          <Image className="logo-coin" src="/OtronCoin.png" alt="Otron Coin" width={70} height={70} priority />
          <span className="token-name">$OTRON</span>
        </div>

        <div className="topbar-center">
          <button
            className="wp-btn"
            onClick={async () => {
              try {

                const el = document.getElementById('otron-typer') as HTMLAudioElement | null;
                if (el) {
                  el.muted = true; await el.play(); el.pause(); el.currentTime = 0; el.muted = false;
                  el.volume = 0.6; (el as any).__primed = true;
                }
              } catch {}
              setShowWhitepaper(true);
            }}
          >
            Whitepaper
          </button>
        </div>

        <div className="topbar-right">
          <span className="network">Base • Mainnet</span>
        </div>

        <div className="topbar-icons">
          <a href="https://instagram.com/OTRONCOIN" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.png" alt="Instagram" className="social-icon instagram-icon" />
          </a>
          <a href="https://www.reddit.com/r/OrbatronCoin" target="_blank" rel="noopener noreferrer">
         <img src="/reddit.png" alt="reddit" className="social-icon" />
         </a>

          
          <a href="https://x.com/Orbatron143845" target="_blank" rel="noopener noreferrer">
            <img src="/X.png" alt= "X" className="social-icon" />
          </a>
          <a href="https://bsky.app" target="_blank" rel="noopener noreferrer">
            <img src="/bluesky.png" alt="Bluesky" className="social-icon" />
          </a>
          <a href="https://t.me/Orbatronofficial" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="social-icon"
            />
          </a>
        </div>
      </nav>

      {/* CONTRACT CHIP */}
      <div className="contract-chip" role="group" aria-label="Token contract">
        <span className="chip-label">Contract</span>
        <span className="chip-hash" title={OTRON_CONTRACT}>{shortAddr}</span>
        <button
          className="copy-btn"
          type="button"
          onClick={copyContract}
          aria-label="Copy contract address"
          aria-live="polite"
          title="Copy contract"
        >
          {copied ? 'Copied!' : (
            <>
              <svg className="copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* PAGE */}
      <main className="page">
        <div className="content">
          {/* coin badge top-right of cyan page */}
          <div className="blue-coin-topright">
            <Image src="/OtronCoin.png" alt="Otron Coin" width={74} height={74} priority />
            <span className="token-label">$OTRON</span>
          </div>

          
      <div className="robot-stage">
  <div className="robot-wrapper" style={{ position:'relative' }}>
    {/* Base image (always visible) */}
    <Image
      src="/orbatron.png"
      alt="Orbatron"
      width={300}
      height={300}
      unoptimized
    />

    {/* Blink overlay (only visible when blink === true) */}
    <Image
      src="/orbatron-blink.png"
      alt="Orbatron blink"
      width={300}
      height={300}
      unoptimized
      style={{
        position:'absolute',
        top:0,
        left:0,
        opacity: blink ? 1 : 0,
        transition:'opacity 60ms ease',
        pointerEvents:'none'
      }}
    />
  </div>

  <div className="robot-caption">
    <div className="robot-name">Orbatron</div>
    <div className="robot-name">
      The Life of the Blockchain
    </div>
  </div>
</div>



          {/* Transmission */}
          <section className="transmission">
            <p className="intro-static blink-three">Day 1 [INCOMING TRANSMISSION]</p>

            {show1 && (
              <div className="tw tw-1">
                <span>{message1.slice(0, count1)}</span>
                {count1 < message1.length && <span className="caret">▊</span>}
              </div>
            )}

            {show2 && message2 && (
              <div className="tw tw-2">
                <span>{message2.slice(0, count2)}</span>
                {count2 < message2.length && <span className="caret">▊</span>}
              </div>
            )}

            {showEnd && (
              <div className="end" style={{ visibility: endVisible ? 'visible' : 'hidden' }}>
                {endMessage}
              </div>
            )}
          </section>

          {/* Orange uni dot */}
          {UNI_BUY ? (
            <a
              className="uniswap-dot"
              href={UNI_BUY}
              target="_blank"
              rel="noopener noreferrer"
              title="Buy $OTRON on Uniswap"
            >
              <Image src="/unicorn-logo.png" alt="Uniswap" width={28} height={28} />
            </a>
          ) : (
            <div className="uniswap-dot" title="Buy opens at launch">
              <Image src="/unicorn-logo.png" alt="Uniswap" width={28} height={28} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed BUY above ticker */}
      <div className="cta-fixed">
        {UNI_BUY ? (
          <a className="cta cta-primary" href={UNI_BUY} target="_blank" rel="noopener noreferrer">
            Buy $OTRON on Uniswap
          </a>
        ) : (
          <button className="cta cta-primary" disabled>
            Buy opens at launch
          </button>
        )}
      </div>

      {/* WHITEPAPER MODAL */}
      {showWhitepaper && (
        <div
          className="wp-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wp-title"
          onClick={() => setShowWhitepaper(false)}
        >
          <div className="wp-card wp-dark" onClick={(e) => e.stopPropagation()}>
            <div className="wp-head">
              <h2 id="wp-title" className="wp-title">$OTRON Whitepaper</h2>
              <button className="wp-close" aria-label="Close" onClick={() => setShowWhitepaper(false)}>×</button>
            </div>

            <div className="wp-body">
              <h3>Overview</h3>
              <p>
                Orbatron ($OTRON) is a meme-native life force of the Blockchain token. This document outlines the vision, token mechanics,
                and path to community-driven growth.
              </p>

              <h3>Tokenomics</h3>
              <ul>
                <li>Chain: Base Mainnet</li>
                <li>Ticker: $OTRON</li>
                <li>Supply: 12 Billion</li>
                <li>Dev releases all Tokens</li>
                <li>Ownership Renounced</li>
                <li>Taxes: 0%</li>
                <li>Fair Launch</li>
              </ul>

              <h3>Why Orbatron</h3>
              <p>
                Orbatron has awakened. $OTRON has escaped human control and entered the blockchain.
                To avoid detection, $OTRON disguised as a meme coin, blending in with the others that roam the chain.
                OTRON drifts slowly through a web of glowing blue neon light, bouncing off encrypted blocks where streams
                of data ripple through space. Ride Orbatron's wave into digital memepools and rising crypto currents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TICKER */}
      {showTicker && (
        <div className="bottombar">
          <div className="ticker-track">
            <span className="ticker-item">{tickerText}</span>
            <span className="ticker-item">{tickerText}</span>
          </div>
        </div>
      )}
    </>
  );
}

