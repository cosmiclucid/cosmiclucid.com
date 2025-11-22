import { useEffect, useRef } from 'react';

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create stars - more stars, smaller size for Milky Way effect
    interface Star {
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      size: number;
      speed: number;
      opacity: number;
      hue: number;
    }

    const stars: Star[] = [];
    const starCount = 260; // tuned for smoother performance while keeping density

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      stars.push({
        x,
        y,
        prevX: x,
        prevY: y,
        size: Math.random() * 0.8 + 0.3, // Smaller stars (0.3-1.1px)
        speed: (Math.random() * 0.15 + 0.05) * 0.7, // Reduced speed by 30%
        opacity: Math.random() * 0.4 + 0.3, // More subtle
        hue: Math.random() * 40 + 200, // Blue-purple hues
      });
    }

    // Animation loop
    let animationFrame: number;
    let frame = 0;
    const animate = () => {
      frame += 1;
      // Very subtle fade for trails - creates the neural network effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural connections between nearby stars
      if (frame % 2 === 0) {
        const cellSize = 140;
        const neighborOffsets = [-1, 0, 1];
        const grid = new Map<string, number[]>();

        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          const cellX = Math.floor(star.x / cellSize);
          const cellY = Math.floor(star.y / cellSize);
          const key = `${cellX},${cellY}`;
          const bucket = grid.get(key);
          if (bucket) {
            bucket.push(i);
          } else {
            grid.set(key, [i]);
          }
        }

        ctx.save();
        ctx.lineWidth = 0.6;

        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          const cx = Math.floor(star.x / cellSize);
          const cy = Math.floor(star.y / cellSize);
          let connections = 0;

          outer: for (const ox of neighborOffsets) {
            for (const oy of neighborOffsets) {
              const bucket = grid.get(`${cx + ox},${cy + oy}`);
              if (!bucket) continue;
              for (const j of bucket) {
                if (j <= i) continue;
                const neighbour = stars[j];
                const dx = star.x - neighbour.x;
                const dy = star.y - neighbour.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 120) {
                  const opacity = (1 - distance / 120) * 0.14;
                  ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
                  ctx.beginPath();
                  ctx.moveTo(star.x, star.y);
                  ctx.lineTo(neighbour.x, neighbour.y);
                  ctx.stroke();
                  connections += 1;
                  if (connections >= 6) break outer;
                }
              }
            }
          }
        }

        ctx.restore();
      }

      // Draw stars and their trails
      stars.forEach((star) => {
        // Draw trail from previous position
        const gradient = ctx.createLinearGradient(star.prevX, star.prevY, star.x, star.y);
        gradient.addColorStop(0, `hsla(${star.hue}, 70%, 80%, 0)`);
        gradient.addColorStop(1, `hsla(${star.hue}, 70%, 80%, ${star.opacity * 0.4})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(star.prevX, star.prevY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Draw star point
        const starGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        starGradient.addColorStop(0, `hsla(${star.hue}, 80%, 90%, ${star.opacity})`);
        starGradient.addColorStop(0.5, `hsla(${star.hue}, 70%, 80%, ${star.opacity * 0.5})`);
        starGradient.addColorStop(1, `hsla(${star.hue}, 60%, 70%, 0)`);
        
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Store previous position
        star.prevX = star.x;
        star.prevY = star.y;

        // Move star
        star.y += star.speed;
        star.x += Math.sin(star.y * 0.01) * 0.1; // Slight horizontal drift
        
        // Reset star position if it goes off screen
        if (star.y > canvas.height + 10) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
          star.prevX = star.x;
          star.prevY = star.y;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-50" />
      
      {/* Solid base behind the stars so blur has something to act on */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated stars canvas (transparent) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      {/* Aurora glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#182E6F]/30 via-[#51158C]/10 to-transparent blur-3xl opacity-60" />

      {/* Progressive gaussian blur: starts near "Scroll to Explore" and strengthens toward cards */}
      {/* Mobile-first (top starts a bit lower) */}
      <div
        className="absolute left-0 right-0 bottom-0 block md:hidden pointer-events-none"
        style={{
          top: '60vh',            // approximate position of the explore indicator on small screens
          zIndex: 1,
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,1) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,1) 100%)',
        }}
      >
        <div
          className="w-full h-full backdrop-blur-[24px]"
          style={{ willChange: 'backdrop-filter' }}
        />
        {/* soft darkening to enhance depth without hard edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />
        {/* micro feather at the start to avoid a visible line */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-black/10" />
      </div>

      {/* Desktop & larger: start slightly higher for better composition */}
      <div
        className="absolute left-0 right-0 bottom-0 hidden md:block pointer-events-none"
        style={{
          top: '53vh',            // desktop placement around the explore indicator, slightly raised
          zIndex: 1,
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,1) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,1) 100%)',
        }}
      >
        <div
          className="w-full h-full backdrop-blur-[28px]"
          style={{ willChange: 'backdrop-filter' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-black/10" />
      </div>
    </div>
  );
}
