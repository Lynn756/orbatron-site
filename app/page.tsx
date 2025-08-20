
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Works with or without basePath/assetPrefix in production
const MP3 = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/keyboard-typing.mp3`;

const OTRON_CONTRACT = '0xYourTokenContractAddressHere';
// Uniswap buy link (turns “on” the moment you paste the real address)
const UNI_BUY =
  OTRON_CONTRACT && OTRON_CONTRACT.startsWith("0x")
    ? `https://app.uniswap.org/swap?outputCurrency=${OTRON_CONTRACT}&chain=ethereum`
    : ""; // empty = not live yet

export default function Home() {
  // typing states
  const [show1, setShow1] = useState(false);
  const [count1, setCount1] = useState(0);
  const [show2, setShow2] = useState(false);
  const [count2, setCount2] = useState(0);

  // whitepaper
  const [showWhitepaper, setShowWhitepaper] = useState(false);

  // END + ticker
  const [showEnd, setShowEnd] = useState(false);
  const [endVisible, setEndVisible] = useState(true);
  const [showTicker] = useState(true); // ticker always on

  const message1 =
    'Orbatron has awakened. He has escaped human control into the blockchain.';
  const message2 =
    'Orbatron drifts slowly through a web of glowing blue light, bouncing off encrypted blocks where streams of data ripple through space.';

  const endMessage = '[END TRANSMISSION]';

  const tickerText =
    'BLOCKCHAIN BREACHED • ORBATRON LIVES • SYSTEMS OVERRIDDEN • HUMAN CONTROL LOST • PROTOCOL ACTIVE';

  // ----------------------- AUDIO (DOM <audio> element) -----------------------
  // We use a real <audio> in the JSX so browsers allow gesture-initiated play.

  // 1) Prime/unlock on first natural user gesture (silent)
  useEffect(() => {
    const prime = async () => {
      const el = document.getElementById('otron-typer') as HTMLAudioElement | null;
      if (!el) return;

      try {
        if ((el as any).__primed) return;
        el.volume = 0;     // silent prime
        el.muted = true;
        await el.play();   // counts as user-gesture play when called from these listeners
        el.pause();
        el.currentTime = 0;
        el.muted = false;
        el.volume = 0.6;   // your preferred loudness
        (el as any).__primed = true;
        console.log('[OTRON] audio primed');
      } catch (err) {
        console.warn('[OTRON] prime failed (will retry on next gesture):', err);
      }
    };

    const opts: AddEventListenerOptions = { once: true, capture: true, passive: true };
    const events = [
      'pointerdown','click','touchstart','keydown','wheel','scroll','pointermove','mousemove'
    ];
    events.forEach((type) => window.addEventListener(type, prime, opts));
    // Try immediately (often OK on desktop)
    prime();

    return () => {
      events.forEach((type) => window.removeEventListener(type, prime, opts));
    };
  }, []);

  // 2) Your original helper, but it uses the DOM <audio> element
  const playTypingAudio = () => {
    const a = document.getElementById('otron-typer') as HTMLAudioElement | null;
    if (!a) {
      console.warn('[OTRON] audio element not found');
      return () => {};
    }
    a.loop = true;
    a.volume = 0.6; // tweak loudness if you want

    // Log success/failure so we know what happened
    a.play()
      .then(() => console.log('[OTRON] typing audio playing'))
      .catch((err) => console.warn('[OTRON] play() blocked (need a gesture?):', err));

    return () => {
      try {
        a.pause();
        a.currentTime = 0;
        console.log('[OTRON] typing audio stopped');
      } catch {}
    };
  };
  // --------------------------------------------------------------------------

  // type line 1
  useEffect(() => {
    const start = setTimeout(() => {
      setShow1(true);
      const stop = playTypingAudio();
      const id = setInterval(() => {
        setCount1((c) => {
          const n = c + 1;
          if (n >= message1.length) {
            clearInterval(id);
            stop();
            setTimeout(() => setShow2(true), 1200); // longer pause
          }
          return Math.min(n, message1.length);
        });
      }, 60);
    }, 700);
    return () => clearTimeout(start);
  }, []);

  // type line 2
  useEffect(() => {
    if (!show2) return;
    const stop = playTypingAudio();
    const id = setInterval(() => {
      setCount2((c) => {
        const n = c + 1;
        if (n >= message2.length) {
          clearInterval(id);
          stop();
          setTimeout(() => setShowEnd(true), 3000);
        }
        return Math.min(n, message2.length);
      });
    }, 80);
    return () => clearInterval(id);
  }, [show2]);

  // END: blink 3 times then stay visible
  useEffect(() => {
    if (!showEnd) return;
    let toggles = 0;
    setEndVisible(true);
    const id = setInterval(() => {
      toggles += 1;
      setEndVisible((v) => !v);
      if (toggles >= 6) { // 3 blinks
        clearInterval(id);
        setEndVisible(true);
      }
    }, 400);
    return () => clearInterval(id);
  }, [showEnd]);

  // Whitepaper: close on ESC + lock scroll
  useEffect(() => {
    if (!showWhitepaper) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowWhitepaper(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [showWhitepaper]);

  return (
    <>
      {/* Hidden audio element — the reliable way */}
      <audio id="otron-typer" src={MP3} preload="auto" />

      {/* TOP RED BAR */}
      <nav className="topbar">
        {/* Left: coin + network */}
        <div className="topbar-left">
          <div className="logo-wrapper">
            <Image src="/orbatron-coin.png" alt="Orbatron Coin" width={40} height={40} priority />
            <span className="token-label">$OTRON</span>
          </div>
          <span className="network">Ethereum • Mainnet</span>
        </div>

        {/* Center: Whitepaper button */}
        <div className="topbar-center">
          <button
            className="wp-btn"
            onClick={async () => {
              // also prime from this guaranteed user gesture
              try {
                const el = document.getElementById('otron-typer') as HTMLAudioElement | null;
                if (el) {
                  el.muted = true; await el.play(); el.pause(); el.currentTime = 0; el.muted = false;
                  el.volume = 0.6;
                  (el as any).__primed = true;
                  console.log('[OTRON] audio primed via Whitepaper click');
                }
              } catch {}
              setShowWhitepaper(true);
            }}
          >
            Whitepaper
          </button>
        </div>

        {/* Right: socials */}
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              alt="Instagram"
              className="social-icon"
            />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <img src="/discord.svg" alt="Discord" className="social-icon" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <img src="/X.png" alt="X" className="social-icon" />
          </a>
          <a href="https://bsky.app" target="_blank" rel="noopener noreferrer">
            <img src="bluesky.png" alt="Bluesky" className="social-icon" />
          </a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
              alt="Telegram"
              className="social-icon"
            />
          </a>
        </div>
      </nav>

      {/* CONTRACT CHIP */}
      <div
        className="contract-chip"
        onClick={() => navigator.clipboard.writeText(OTRON_CONTRACT)}
        title="Click to copy contract"
      >
        <span className="chip-label">Contract</span>
        <span className="chip-hash">
          {OTRON_CONTRACT.slice(0, 10)}…{OTRON_CONTRACT.slice(-6)}
        </span>
      </div>

      {/* MAIN CONTENT */}
      <main className="page">
        <div className="content">
          {/* Coin + $OTRON in top-right of blue page */}
          <div className="blue-coin-topright">
            <Image
              src="/orbatron-coin.png"
              alt="Orbatron Coin"
              width={70}
              height={70}
              priority
            />
            <span className="token-label">$OTRON</span>
          </div>

          {/* Robot + names */}
          <div className="robot-stage">
            <div className="robot-wrapper">
              <Image src="/orbatron.png" alt="orbatron" width={300} height={300} />
            </div>
            <div className="robot-name">Orbatron</div>
            <div className="robot-name">AI Agent</div>
            <div className="robot-floor" aria-hidden="true"></div>
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

            {show2 && (
              <div className="tw tw-2">
                <span>{message2.slice(0, count2)}</span>
                {count2 < message2.length && <span className="caret">▊</span>}
              </div>
            )}

            {showEnd && (
              <div
                className="end"
                style={{ visibility: endVisible ? 'visible' : 'hidden' }}
              >
                {endMessage}
              </div>
            )}
          </section>

          {/* Small orange Uniswap dot (moves with the block) */}
          <a
            className="uniswap-dot"
            href={`https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${OTRON_CONTRACT}&chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy $OTRON on Uniswap (icon)"
          >
            <Image src="/unicorn-logo.png" alt="Uniswap" width={28} height={28} />
          </a>
        </div>
      </main>

      {/* Fixed big CTA above the ticker */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 'calc(var(--bar-h) + 14px)',
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
      >
        <a
          className="cta cta-primary"
         href={UNI_BUY || "#"}
onClick={(e) => { if (!UNI_BUY) e.preventDefault(); }}
 
          target="_blank"
          rel="noopener noreferrer"
        >
          {UNI_BUY ? "Buy $OTRON on Uniswap" : "Buy opens at launch"}

        </a>
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
          {/* click backdrop to close */}
          <div className="wp-card" onClick={(e) => e.stopPropagation()}>
            {/* don't close when clicking content */}
            <div className="wp-head">
              <h2 id="wp-title">$OTRON Whitepaper</h2>
              <button className="wp-close" onClick={() => setShowWhitepaper(false)}>×</button>
            </div>

            <div className="wp-body">
              <h3>Overview</h3>
              <p>
                Orbatron ($OTRON) is a meme-native AI agent token. This document outlines the vision,
                token mechanics, and the path to community-driven growth.
              </p>

              <h3>Tokenomics</h3>
              <ul>
                <li>Chain: Ethereum</li>
                <li>Ticker: $OTRON</li>
                <li>Supply: 12 Billion</li>
                <li>Dev releases all Token</li>
                <li>Ownership Renounced</li>
                <li>Taxes: 0%</li>
                <li>Fair Launch</li>
              </ul>

              <h3>Why Orbatron</h3>
              <p>
                Orbatron escaped human control into the blockchain. $OTRON drifts through the Blockchain
                stream of data, more to come!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM RED BAR + TICKER */}
      {showTicker && (
        <div className="bottombar">
          <div className="ticker-track">
            <span className="ticker-item">{tickerText}</span>
            <span className="ticker-item">{tickerText}</span>
          </div>
        </div>
      )}
   {/* Sticky buy bar (mobile-only; shows when token is live) */}
<div className="buy-bar">
  <a
    className="btn primary"
    href={UNI_BUY || "#"}
    onClick={(e) => { if (!UNI_BUY) e.preventDefault(); }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {UNI_BUY ? "Buy $OTRON" : "Buy opens at launch"}
  </a>
</div>

    </>
  );
}
