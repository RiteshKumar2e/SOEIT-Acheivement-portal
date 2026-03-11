import { useEffect, useRef } from 'react';

/**
 * CaptchaCanvas — Green bold digits, spaced out,
 * small purple/blue scattered dots, white background.
 * Matches the "2 4 0 3" style pattern.
 */
const CaptchaCanvas = ({ captcha }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !captcha) return;
        const ctx = canvas.getContext('2d');

        const W = canvas.width;
        const H = canvas.height;

        // ── Clear / White background ─────────────────────────────────
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        // ── Small scattered dots (purple + blue tones) ───────────────
        const dotColors = ['#5b4fcf', '#3b58c4', '#7c3aed', '#2563eb', '#6d28d9', '#1d4ed8'];
        for (let i = 0; i < 120; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * W,
                Math.random() * H,
                Math.random() * 1.2 + 0.4,   // tiny dots: 0.4–1.6px
                0,
                2 * Math.PI
            );
            ctx.fillStyle = dotColors[Math.floor(Math.random() * dotColors.length)];
            ctx.globalAlpha = 0.45 + Math.random() * 0.4;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── Characters — large green bold, spaced ────────────────────
        const chars = captcha.split('');
        const cellW = W / chars.length;

        chars.forEach((ch, i) => {
            const x = cellW * i + cellW / 2;
            const y = H / 2 + (Math.random() * 6 - 3);       // ±3px vertical jitter
            const angle = (Math.random() - 0.5) * 0.25;        // very slight tilt

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            ctx.font = `900 26px Arial Black, Arial, sans-serif`;
            ctx.fillStyle = '#1e8a1e';   // solid green, matching image
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ch, 0, 0);

            ctx.restore();
        });
    }, [captcha]);

    return (
        <canvas
            ref={canvasRef}
            width={120}
            height={42}
            style={{
                display: 'block',
                flexShrink: 0,
                cursor: 'default',
                userSelect: 'none',
            }}
            aria-label="Captcha image"
        />
    );
};

export default CaptchaCanvas;
