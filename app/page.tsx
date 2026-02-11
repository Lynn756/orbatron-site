'use client';

import { useState } from 'react';
import Image from 'next/image';

// ⬇️ replace on launch
const OTRON_CONTRACT = '0x259b9068fa3f1D6813bA9A8580Cda46337cBdaAd';

const UNI_BUY =
  OTRON_CONTRACT && OTRON_CONTRACT.startsWith('0x')
    ? `https://app.uniswap.org/swap?outputCurrency=${OTRON_CONTRACT}&chain=base`
    : '';

export default function Page() {
  const [copied, setCopied] = useState(false);
  const [showWhitepaper, setShowWhitepaper] = useState(false);

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
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const shortAddr =
    OTRON_CONTRACT && OTRON_CONTRACT.startsWith('0x') && OTRON_CONTRACT.length > 12
      ? `${OTRON_CONTRACT.slice(0, 10)}…${OTRON_CONTRACT.slice(-6)}`
      : OTRON_CONTRACT;

  const tickerText =
    'BLOCKCHAIN BREACHED • ORBATRON LIVES • SYSTEMS OVERRIDDEN • HUMAN CONTROL LOST • PROTOCOL ACTIVE';

  return (
    <>
      {/* TOP BAR */}
      <nav className="topbar">
        <div className="topbar-left">
          <Image
            className="logo-coin"
            src="/Orbatron_64.png"
            alt="Otron Coin"
            width={70}
            height={70}
            priority
          />
          <span className="token-name">$OTRON</span>
        </div>

        <div className="topbar-center">
          <button className="wp-btn" onClick={() => setShowWhitepaper(true)}>
            Whitepaper
          </button>
        </div>

        <div className="topbar-right">
          <span className="network">Base • Mainnet</span>
        </div>

        <div className="topbar-icons">
          <a href="https://instagram.com/orbatroncoin" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.png" alt="Instagram" className="social-icon instagram-icon" />
          </a>

          <a href="https://www.reddit.com/r/OrbatronCoin" target="_blank" rel="noopener noreferrer">
            <img src="/reddit.png" alt="reddit" className="social-icon" />
          </a>

          <a href="https://x.com/Orbatroncoin" target="_blank" rel="noopener noreferrer">
            <img src="/X.png" alt="X" className="social-icon" />
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
        <span className="chip-hash" title={OTRON_CONTRACT}>
          {shortAddr}
        </span>

        <button
          className="copy-btn"
          type="button"
          onClick={copyContract}
          aria-label="Copy contract address"
          aria-live="polite"
          title="Copy contract"
        >
          {copied ? (
            'Copied!'
          ) : (
            <>
              <svg className="copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"
                  fill="currentColor"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* EMAIL */}
      <div className="contact-email">
        Contact: <a href="mailto:orbatroncoin@proton.me">orbatroncoin@proton.me</a>
      </div>

      {/* PAGE */}
      <main className="page">
        <div className="content">
          {/* 3-UP ROW: LEFT = COOK(+BLISTER), CENTER = MAIN, RIGHT = FIRE(+CANYON) */}
          <div
            style={{
              width: '100%',
              maxWidth: 980,
              margin: '22px auto 0',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'start',
              gap: 22,
            }}
          >
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src="/Cook.PNG"
                alt="Kiss the Cook"
                width={220}
                height={220}
                unoptimized
                style={{ borderRadius: 8 }}
              />

              {/* LEFT — second pic under Kiss the Cook */}
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <Image
                  src="/Blister.PNG"
                  alt="Blister"
                  width={220}
                  height={220}
                  unoptimized
                  style={{ borderRadius: 8 }}
                />
                <div className="pic-title">Blister</div>
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="robot-stage" style={{ marginTop: 0 }}>
              <div className="robot-wrapper" style={{ position: 'relative' }}>
                <Image
                  src="/new.png"
                  alt="new"
                  width={300}
                  height={300}
                  unoptimized
                  style={{ display: 'block' }}
                />
              </div>

              <div className="robot-caption" style={{ marginTop: 12 }}>
                <div className="robot-name">Orbatron</div>
                <div className="robot-name">A SIGNAL FROM BASEION</div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image
                src="/Fire.PNG"
                alt="Fire"
                width={220}
                height={220}
                unoptimized
                style={{ borderRadius: 8, opacity: 0.85 }}
              />

              {/* RIGHT — second pic under Fire */}
              <div style={{ textAlign: 'center', marginTop: 18 }}>
                <Image
                  src="/Canyon.JPG"
                  alt="Canyon"
                  width={220}
                  height={220}
                  unoptimized
                  style={{ borderRadius: 8 }}
                />
                <div className="pic-title">Canyon</div>
              </div>
            </div>
          </div>

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
              <h2 id="wp-title" className="wp-title">
                $OTRON Whitepaper
              </h2>
              <button className="wp-close" aria-label="Close" onClick={() => setShowWhitepaper(false)}>
                ×
              </button>
            </div>

            <div className="wp-body">
              <h3>Overview</h3>
              <p>
                Orbatron ($OTRON) is a meme-native life force of the Blockchain token. This document outlines the
                vision, token mechanics, and path to community-driven growth.
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
                Orbatron has awakened. $OTRON has escaped human control and entered the blockchain. To avoid detection,
                $OTRON disguised as a meme coin, blending in with the others that roam the chain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM TICKER */}
      <div className="bottombar">
        <div className="ticker-track">
          <span className="ticker-item">{tickerText}</span>
          <span className="ticker-item">{tickerText}</span>
        </div>
      </div>
    </>
  );
}
