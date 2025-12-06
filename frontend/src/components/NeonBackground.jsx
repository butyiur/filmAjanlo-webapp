import { useEffect } from "react";

export default function NeonBackground() {
    useEffect(() => {
        let canvas = document.getElementById("neon-canvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "neon-canvas";

            Object.assign(canvas.style, {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,               //  <<< FONTOS!!!
                pointerEvents: "none",
                opacity: 0.35
            });

            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const createLine = () => ({
            x: Math.random() * canvas.width,
            y: -100 - Math.random() * 200,
            speed: 2 + Math.random() * 4,
            length: 40 + Math.random() * 120,
            color: ["#00f0ff22", "#ff00ff22", "#00ffaa22"][Math.floor(Math.random() * 3)]
        });

        let lines = Array.from({ length: 20 }).map(createLine);

        function animate() {
            if (!document.getElementById("neon-canvas")) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            lines.forEach((l, i) => {
                ctx.beginPath();
                ctx.strokeStyle = l.color;
                ctx.lineWidth = 2;
                ctx.moveTo(l.x, l.y);
                ctx.lineTo(l.x, l.y + l.length);
                ctx.stroke();

                l.y += l.speed;

                if (l.y > canvas.height + 50) {
                    lines[i] = createLine();
                }
            });

            if (Math.random() < 0.02) {
                lines.push(createLine());
                if (lines.length > 120) lines.shift();
            }

            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    return null;
}