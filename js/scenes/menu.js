/**
 * menu.js — หน้าเมนูหลัก, background animation
 */

const MenuScene = (() => {
  let canvas, ctx, animId;
  let particles = [];

  function render() {
    canvas = document.getElementById('menu-bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    initParticles();
    if (animId) cancelAnimationFrame(animId);
    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random(),
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Deep night sky
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0d0d1a');
    grad.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floating pixel stars
    particles.forEach(p => {
      p.y -= p.speed;
      p.opacity += Math.sin(Date.now() * 0.001 + p.x) * 0.01;
      p.opacity = Math.max(0.1, Math.min(1, p.opacity));
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(animate);
  }

  return { render };
})();
