import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../../assets/icons8-home-48.png';

const PANEL_WIDTH = 260;   // card width like your screenshot
const PANEL_GAP   = 12;    // space below the hamburger

const TopBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // close on outside click / ESC
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (hamburgerRef.current && hamburgerRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.addEventListener('mousedown', onDocMouseDown);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // position the panel under the hamburger (right-aligned), clamped to viewport
  const positionMenu = () => {
    const btn = hamburgerRef.current?.getBoundingClientRect();
    if (!btn) return;
    const vw = window.innerWidth;

    // align panel’s right edge to the button’s right edge
    let left = btn.right - PANEL_WIDTH;
    // clamp inside viewport with 16px margin
    left = Math.max(16, Math.min(left, vw - PANEL_WIDTH - 16));
    const top = btn.bottom + PANEL_GAP;

    setMenuPos({ top, left });
  };

  const toggleMenu = () => {
    if (!open) positionMenu();
    setOpen(v => !v);
  };

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="top-bar">
      <div className="top-bar-title">
        <h2>RESUMIX</h2>
      </div>

      {/* RIGHT: Home then Hamburger */}
      <div className="top-bar-buttons">
        <button onClick={() => go('/postlogin/')}>
          <img src={home} alt="Home" width="30" height="30" />
          <span>Home</span>
        </button>

        <button
          ref={hamburgerRef}
          aria-label="Open navigation"
          className="hamburger-btn"
          onClick={toggleMenu}
        >
          <img className="hamburger-img" src="/menu.png" alt="Menu" />
        </button>
      </div>

      {/* Dropdown (fixed to viewport so it can't get clipped) */}
      {open && (
        <div
          ref={menuRef}
          className={`nav-menu open`}
          role="menu"
          aria-hidden={!open}
          style={{
            position: 'fixed',
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            width: PANEL_WIDTH,
            zIndex: 2000,
            borderRadius: 16,
            overflow: 'hidden',
            // keep your existing look but ensure it’s visible on white pages
            background: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <button className="nav-item" onClick={() => go('/dashboard')} role="menuitem"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <img className="nav-item-icon" src="/layout.png" alt="Dashboard" />
            <span style={{ display: 'inline' }}>Dashboard</span>
          </button>

          <button className="nav-item" onClick={() => go('/resumes')} role="menuitem"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <img className="nav-item-icon" src="/navr.png" alt="Resumes" />
            <span style={{ display: 'inline' }}>Resumes</span>
          </button>

          <button className="nav-item" onClick={() => go('/templates')} role="menuitem"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <img className="nav-item-icon" src="/stack.png" alt="Templates" />
            <span style={{ display: 'inline' }}>Templates</span>
          </button>

          <button className="nav-item" onClick={() => go('/subscription')} role="menuitem"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <img className="nav-item-icon" src="/subscription.png" alt="Subscription" />
            <span style={{ display: 'inline' }}>Subscription</span>
          </button>

          <button className="nav-item" onClick={() => go('/settings')} role="menuitem"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <img className="nav-item-icon" src="/pro.png" alt="Account" />
            <span style={{ display: 'inline' }}>Account</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TopBar;
