# 🏫 Minervaa Vidhya Mandhir - School Website

A fully animated, colorful, and visually appealing school website built with React, TailwindCSS, and Framer Motion.

## ✨ Features

- **Vibrant Hero Section** - Animated school logo with floating icons and gradient text
- **About Us** - Vision, Mission, Values, and Diversity cards with smooth animations
- **Academics** - Interactive tabs showcasing Kindergarten, Primary, and Higher Secondary programs
- **World-Class Facilities** - Smart classrooms, labs, sports, library, and more with hover effects
- **Dynamic Gallery** - Beautiful grid layout with zoom effects and modal view
- **Contact Form** - Fully functional contact form with social media links
- **Responsive Design** - Mobile-friendly layout that works on all devices
- **Smooth Animations** - Framer Motion animations throughout with scroll-triggered effects

## 🎨 Design Highlights

- Bright, cheerful colors (sky blue, yellow, orange, green, purple, pink)
- Playful typography with Google Fonts (Poppins & Bubblegum Sans)
- Floating particles background effect
- Gradient backgrounds and animated gradient text
- Hover effects and interactive elements
- Smooth scrolling navigation
- Beautiful shadows and rounded corners

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
Minervaa School/
├── src/
│   ├── components/
│   │   ├── FloatingParticles.jsx
│   │   ├── Navigation.jsx
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── AcademicsSection.jsx
│   │   ├── FacilitiesSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── ContactSection.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Google Fonts** - Poppins & Bubblegum Sans

## 🎯 Sections

1. **Home** - Eye-catching hero with animated elements
2. **About Us** - School vision, mission, values, and diversity
3. **Academics** - Educational programs for all age groups
4. **Facilities** - Campus amenities and resources
5. **Gallery** - Photo showcase with interactive modal
6. **Contact** - Contact form and school information

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: { /* blue shades */ },
  secondary: { /* yellow shades */ },
  accent: { /* orange, green, purple, pink */ }
}
```

### Animations

Modify animation durations and styles in:
- `tailwind.config.js` for keyframe animations
- Component files for Framer Motion animations

### Content

Update text content, contact information, and school details in the respective component files under `src/components/`.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌟 Best Viewed On

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is created for Minervaa Vidhya Mandhir.

## 💡 Tips

- For best experience, use a modern browser with hardware acceleration enabled
- The website uses smooth scroll behavior - make sure it's not disabled in your browser
- Animations are optimized for performance but may vary based on device capabilities

---

**Made with ❤️ for Minervaa Vidhya Mandhir - Inspiring Minds, Building Futures**

<!-- Redeploy trigger: 2026-02-07  -->
