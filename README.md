# Interactive A/B Test Conversion Rate Chart

An interactive line chart application for visualizing A/B test conversion rates.
Built with React, TypeScript, Recharts, and Mantine.

#### You can check it out right now on https://volniy1.github.io/Interactive-Line-Chart/

# 1 - Chosen Visualization Library

**Recharts** (v3.4.1) - A composable charting library built on React components.
link - https://recharts.github.io/en-US/

# 2 - Features

### Requirements Done

- Conversion rate line chart for all variations (values displayed as percentages)
- Interactive tooltip with vertical line and daily data popup on hover
- At least one variation always selected
- Dynamic X and Y axes that adapt to visible data range
- All values displayed as percentages
- Responsive layout (671px - 1300px)
- **Controls**:
  - Variations selector (choose which lines to display)
  - Day / Week selector

### Bonus Features

- **Zoom Controls**: Zoom In, Zoom Out, Reset Zoom
- **Line Style Selector**: Smooth, Line, Area
- **Light / Dark Theme Toggle**
- **Export to PNG**

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2
- Recharts 3.4.1
- Mantine 8.3.7
- Sass 1.94.0

# 3 - Local Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open browser** at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

**Author**: Arthur Koshelenko
