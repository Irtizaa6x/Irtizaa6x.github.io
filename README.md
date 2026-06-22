```markdown
# 🌿 Md. Irtija Azad Talha – Executive Portfolio

A modern, fully responsive personal portfolio website built with vanilla HTML, CSS, and JavaScript. Designed with a **Forest Green** aesthetic and a solid sidebar navigation, this portfolio showcases your profile, educational qualifications, activities & experience, skills, and contact information – all backed by a clean `data.js` file for easy content management.

---

## 🚀 Features

- **Dynamic Content** – Experiences and skills are rendered from `data.js`; no need to touch the HTML for updates.
- **Two-Column Layout** – Activities page splits into **Experience (2/3)** and **Certifications & Achievements (1/3)** on desktop, with smooth stacking on mobile.
- **Live Dhaka Time** – Displays real-time clock with day/night icon (sun/moon).
- **Collapsible Skill Categories** – Each skill category shows a “show all” overlay; click to expand and collapse.
- **Mobile‑First** – Hamburger navigation, scroll‑away header, and touch‑friendly interactions.
- **Dark Sidebar** – Solid carbon background with subtle green accents, matching the forest theme.
- **Smooth Scrolling** – Clickable “Certifications & Achievements” hint (mobile only) scrolls to the certifications section.
- **Copy Discord Username** – One‑click copy for Discord handle.

---

## 📁 Project Structure

```
.
├── index.html          # Main HTML structure
├── style.css           # All styles (Forest Green palette)
├── script.js           # Core logic: navigation, rendering, interactions
├── data.js             # All dynamic content (experiences, skills)
└── README.md           # This file
```

---

## 🎨 Color Palette

| Role | Color Code |
|------|------------|
| Carbon (sidebar) | `#1f2421` |
| Stormy (primary accents) | `#216869` |
| Seaweed (icons & highlights) | `#49a078` |
| Muted Teal (soft backgrounds) | `#9cc5a1` |
| Alabaster (main background) | `#dce1de` |

---

## 📦 How to Use / Customize

### 1. Update Content
- **Experiences** – Edit the `experiences` array in `data.js`.  
  - Each entry can have `id`, `title`, `role`, `startDate`, `endDate` (or `null` for ongoing), `icon` (FontAwesome class), `description`, `parentClub`, and `certButtons`.
  - The entry with `id: 'certifications'` is rendered separately as a card with an “Ongoing” badge.
- **Skills** – Edit the `skills` object, which has four categories: `cyber`, `web`, `networking`, and `professional`.  
  - Each skill object requires `name` and `icon` (FontAwesome class).

### 2. Replace Profile Image
- Place your photo as `Talha.jpg` in the root folder (or update the `src` in the `<img>` tag inside `index.html`).

### 3. Change Personal Details
- All personal information (name, DOB, etc.) is in the **Home** page HTML – update directly in `index.html`.

### 4. Add / Remove Pages
- The sidebar navigation is defined in `index.html` with `data-page` attributes.  
- Each page’s content is a `<div>` with an `id` matching the `data-page` value.  
- Update `script.js` if you add new pages (add to the `pages` object).

### 5. Modify Styling
- All CSS variables are in `:root` inside `style.css`. Tweak colors, radii, shadows, and more to match your brand.

---

## 📱 Responsive Behavior

- **Desktop** – Sidebar fixed left, main content scrolls.  
- **Tablet** – Sidebar width reduces, contact cards switch to 2 columns.  
- **Mobile** – Sidebar slides in from the right, header becomes fixed, all content stacks vertically.  
- **Activities Page** – Two‑column layout on desktop; on mobile, Experience appears first, then a clickable hint (“Check my Certifications & Achievements below”) leads to the certifications card.

---

## 🧠 Technologies Used

- **HTML5** – Semantic markup  
- **CSS3** – Flexbox, Grid, custom properties, animations  
- **JavaScript (ES6)** – DOM manipulation, event handling, dynamic rendering  
- **Font Awesome 6** – Icons  
- **Google Fonts** – Inter & Playfair Display

---

## 🔧 Development Notes

- The page uses **no build tools** – it’s pure static HTML/CSS/JS.  
- All external assets are loaded via CDN.  
- The `data.js` file must be included **before** `script.js` in the HTML.  
- The `calculateDuration` function in `script.js` automatically computes the time difference from `startDate` to `endDate` (or to now if ongoing).  
- The skills collapsible feature is dynamically initialised after rendering.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to use it for your own portfolio.

---

## 👤 Author

**Md. Irtija Azad Talha**  
- GitHub: [Irtizaa6x](https://github.com/Irtizaa6x)  
- LinkedIn: [irtija-talha](https://linkedin.com/in/irtija-talha)

---

## 🙏 Credits

Designed with 💚 and powered by AI assistance for code structuring and optimisation.
```

---
