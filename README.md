# 🎨 Saqib — The Artist · Art Shop

A simple, elegant art shop webpage for **Saqib — The Artist** — original art prints, commissions, drawing lessons and merch featuring his characters **Pip & Inky**.

## Brand

- **Obsidian Black** `#0B0B0B` · **Artist Gold** `#C99A3A` · **Canvas White** `#F3F0E8`
- **Playfair Display** (display) + **Montserrat** (supporting)

## Features

- 🖼️ Product grid with prices (PKR)
- 🛒 Cart drawer with localStorage persistence
- 💬 One-tap checkout — copies the order summary and opens TikTok DM
- 📱 Fully responsive

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy

This is a static site — deploy anywhere (Vercel, Netlify, GitHub Pages). On Vercel, import this repo and ship it; no build step needed.

> **Note:** `images/*.webp` are stored as **base64 text**, not binary — the GitHub App API used to publish this repo can't push binary files. `app.js` fetches and decodes them to real images at runtime, so the site works normally.

## Ordering

Orders are taken via TikTok DM: [@curioussaqibartist](https://www.tiktok.com/@curioussaqibartist). Payment & delivery details are confirmed in chat.
