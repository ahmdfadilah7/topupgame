// Minimal script for visual effects only, stripped of all SPA navigation logic

// Matrix Canvas Logic
const c = document.getElementById("matrix-canvas");
if(c) {
    const ctx = c.getContext("2d");
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%".split("");
    const font_size = 14;
    const columns = c.width / font_size;
    const drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;
    function draw() {
        ctx.fillStyle = "rgba(10, 10, 26, 0.05)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#00f5d4";
        ctx.font = font_size + "px arial";
        for(let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * font_size, drops[i] * font_size);
            if(drops[i] * font_size > c.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);

