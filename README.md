# Stylecraft Image Resizer 🚀

**🔗 Live Demo:** [dasarijashwanth.github.io/stylecraft-resizer](https://dasarijashwanth.github.io/stylecraft-resizer/)

A premium, fully client-side web application designed to help creators, designers, and admins crop, resize, pad, and package images for multiple dimensions simultaneously. Inspired by the professional styling aesthetic of [StyleCraft US](https://stylecraftus.com/), it features glowing luxury themes, high-contrast grids, and real-time local AI-style padding synthesis.

---

## ✨ Key Features

### 1. 🖼️ Multi-Preset Batch Resizing
Generate up to **29+ output sizes in one click** categorized logically into:
- **Social Media**: Instagram Posts, Stories, Reels, Profile Pictures; Facebook Cover/Post; Twitter/X Header/Post; YouTube Thumbnails; Pinterest Pins; TikTok covers; LinkedIn headers, posts, and profiles.
- **Print Formats**: Standard print dimensions including US Letter, A4, Postcard, Poster (18x24), and custom ratios.
- **Web & App Presets**: Standard banners, display ads, hero images, and favicons.

### 2. 🧠 Local AI Background Generator
Never stretch or crop your images awkwardly again. When fitting images into different ratios, the app uses a **100% client-side AI Background synthesis engine** supporting:
- **Content-Aware Mirror**: Mirrors border pixels and overlays realistic film noise.
- **AI Ambient Aura**: Dynamically extracts dominant color palettes from the uploaded image and renders a highly blurred, professional studio backdrop gradient.
- **AI Gilded Luxury**: Blends image colors with StyleCraft's signature dark metallic and gold gridlines.
- **AI Cyberpunk Grid**: Multiplies border hues into high-vibrancy gradients layered with a glowing digital mesh.
- *Includes customizable AI Prompts and style tag guides to scale film grain.*

### 3. 📄 Lossless Word Document (.doc) Export
Exporting text-heavy graphics or vector layouts? Standard compression blurs typography. The app packs high-res image assets inside an **HTML-embedded vector wrapper (.doc)**, ensuring text never blurs or corrupts even when zoomed to 400% inside Word processor suites.

### 4. 🔍 Draggable Details Preview Modal
Before downloading, inspect any preset at full resolution in a modal:
- Draggable panning across large assets.
- Mouse/touch pinch-to-zoom (up to 400%).
- Comparative rendering toggles: **Smooth bilinear interpolation** vs. **Nearest-neighbor Pixelated grid** rendering.

### 5. ☁️ Google Drive Cloud Sync
A simulated OAuth handshake wizard allows you to select preset dimensions and sync them straight into a named folder inside Google Drive.

### 6. 🔐 Admin Access & Custom Sizes
- Log in with credentials to unlock the **Admin Dashboard** panel.
- Create, persist, select, and delete custom dimension presets stored locally in your browser storage (`localStorage`).

---

## 🛠️ Architecture & Technology Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Custom glassmorphic styles and keyframe ambient glow elements.
- **Resampling Engine**: Custom browser-side Canvas API implementation with:
  - **Hermite Filter**: Pixel-weighted bilinear curve accumulator to ensure text/lines remain crisp.
  - **Bicubic Smoothing**: Smooth high-quality scaling for photographic source images.
- **Compression packaging**: `jszip` and `file-saver` to bundle and download everything as a single `.zip` file.
- **Modularity**: Fully client-side processing. Your images are never sent to external servers; your privacy is 100% guaranteed.

---

## 🚦 Local Development

### Prerequisites
Make sure you have Node.js installed on your machine.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dasarijashwanth/stylecraft-resizer.git
   cd stylecraft-resizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   *(On Windows systems where script execution is restricted, run using the `.cmd` wrapper: `npm.cmd run dev`)*

4. **Build the production bundle**:
   ```bash
   npm run build
   ```

---

## 🚀 GitHub Actions Deployment Workflow

The project is pre-configured for automatic deployment to **GitHub Pages**. 

When code is pushed to the `main` branch, a GitHub Actions workflow (`.github/workflows/deploy.yml`) is triggered to:
1. Check out the repository.
2. Set up Node.js with package caching.
3. Install dependencies and build static assets using a relative base path (`./`).
4. Upload the built artifact and publish it to the repository's GitHub Pages.

### Setup Instructions
To deploy this project to your GitHub Pages:
1. Go to your repository settings page: **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, change it from *Deploy from a branch* to **GitHub Actions**.
3. Push any commit or re-run the action on the **Actions** tab. Your website will be live in seconds!
