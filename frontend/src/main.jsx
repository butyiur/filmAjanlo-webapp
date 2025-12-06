import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import './index.css'

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#9c27b0" },
    },
    shape: { borderRadius: 12 },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
);


// Neon cursor light effect
document.addEventListener("mousemove", (e) => {
    const light = document.getElementById("cursor-light");
    if (light) {
        light.style.left = e.clientX + "px";
        light.style.top = e.clientY + "px";
    }
});


// Parallax background effect
document.addEventListener("mousemove", (e) => {
    const bg = document.getElementById("parallax-bg");
    if (!bg) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    bg.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
});