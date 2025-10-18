import React, { useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let shootingStars = [];
    let emojiRain = [];
    let animationId;
    let pinkMode = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // ---------- Classes ----------
    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1 || this.opacity < 0.3) this.twinkleSpeed *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 7 + 4;
        this.angle = Math.PI / 4;
        this.opacity = 1;
        this.width = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.opacity -= 0.01;
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - this.length * Math.cos(this.angle),
          this.y - this.length * Math.sin(this.angle)
        );
        ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.lineWidth = this.width;
        ctx.shadowBlur = 5;
        ctx.shadowColor = "white";
        ctx.stroke();
      }
    }

    class Emoji {
      constructor(emoji) {
        this.emoji = emoji;
        this.x = Math.random() * canvas.width;
        this.y = -30;
        this.size = Math.random() * 30 + 20;
        this.speed = Math.random() * 4 + 2;
      }
      update() {
        this.y += this.speed;
      }
      draw() {
        ctx.font = `${this.size}px serif`;
        ctx.fillText(this.emoji, this.x, this.y);
      }
    }

    // ---------- Initialization ----------
    for (let i = 0; i < 80; i++) stars.push(new Star());
    const emojis = ["🍰","🍩","🍪","🍫","🧁"];

    // ---------- Emoji rain function ----------
    const startEmojiRain = () => {
      pinkMode = true;
      emojiRain = [];
      const duration = 2000; // 2 seconds emoji generation
      const startTime = Date.now();

      const generateEmojis = () => {
        if (Date.now() - startTime < duration && emojiRain.length < 15) {
          emojiRain.push(new Emoji(emojis[Math.floor(Math.random() * emojis.length)]));
          requestAnimationFrame(generateEmojis);
        }
      };
      generateEmojis();
    };

    // ---------- Animation loop ----------
    const animate = () => {
      ctx.fillStyle = pinkMode ? "#ff69b4" : "#0a0a30";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!pinkMode) {
        stars.forEach(star => { star.update(); star.draw(); });
        if (Math.random() < 0.01 && shootingStars.length < 3) shootingStars.push(new ShootingStar());
        shootingStars.forEach((s,i) => { s.update(); s.draw(); if(s.opacity<=0) shootingStars.splice(i,1); });
      }

      emojiRain.forEach((e,i) => {
        e.update();
        e.draw();
        if (e.y > canvas.height + 50) emojiRain.splice(i,1);
      });

      if (pinkMode && emojiRain.length === 0) pinkMode = false;

      animationId = requestAnimationFrame(animate);
    };
    animate();

    window.startEmojiRain = startEmojiRain;

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="background-canvas"></canvas>

      <section className="hero">
        <div className="glass hero-content">
          <h1>🎵mapusaa!🎵</h1>
          <p>made that playlist for you type shi</p>

          <button className="dessert-btn" onClick={() => window.startEmojiRain()}>
            🤔
          </button>
        </div>
      </section>

      <section className="spotify-section">
        <div className="glass spotify-container">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/4QTGDbt7xvsPidS6InAuLl?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
          ></iframe>
        </div>
      </section>

      <footer>
        <p>enjoy the playlist maams</p>
      </footer>
    </div>
  );
}
