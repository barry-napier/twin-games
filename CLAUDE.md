# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Twin Games Collection is a Progressive Web Application (PWA) featuring educational and entertainment games for children named Sarah & Finn. All games are client-side HTML5/CSS/JavaScript with no backend dependencies.

## Architecture

### Two Game Development Patterns
1. **Self-contained** (13 games): Single `index.html` with embedded CSS/JavaScript
2. **Modular** (1 game - bubble-pop): Separate HTML, CSS, JS files with local manifest

### Key Files
- `index.html` - Main game launcher with 4 featured games grid
- `sw.js` - Service worker for offline functionality (caches main games)
- `manifest.json` - PWA configuration for app-like experience
- `icon-192.svg`, `icon-512.svg` - App icons
- Game directories at root level (25 total, 14 implemented, 11 unimplemented)

### Game Implementation Status

**Implemented Games (14):**
- **Featured/Cached**: marble-maze, rhythm-tap, color-chain, space-defender
- **Additional**: alphabet-adventure, animal-sounds, balloon-pop, bubble-pop, catch-a-critter, color-match, drawing-canvas, memory-cards, number-counting, shape-puzzle

**Unimplemented Directories (11):**
animal-memory, animal-memory-match, animal-piano, color-mixing-lab, counting-cookies, dress-up-doll, musical-drums, paint-and-draw, shape-sorter, catch-the-stars, story-sequencer

### Technology Usage
- **Canvas-based**: space-defender, drawing-canvas, marble-maze
- **DOM-based**: Most puzzle/educational games
- **External libraries**: Only marble-maze uses canvas-confetti
- **Theme support**: marble-maze (full), bubble-pop (partial)
- **PWA features**: bubble-pop (full manifest), main app level

## Development Commands
No build process - static site. For development:
- VS Code Live Server (configured port 5501 in .vscode/settings.json)
- Python: `python3 -m http.server 8000`
- Node: `npx serve`
- Games run directly without compilation

## Adding New Games

1. Create new directory at root level (e.g., `/game-name/`)
2. Follow existing patterns:
   - **Preferred**: Self-contained `index.html` with embedded styles/scripts
   - **Complex games**: Separate files if needed (see bubble-pop example)
3. Add to main launcher:
   - Edit `/index.html` - add game card to grid
   - Update game count and grid layout
4. For offline support:
   - Add to `urlsToCache` array in `/sw.js`
   - Update `CACHE_NAME` version when modifying cached files

## Game Development Guidelines

### Essential Features for All Games
- Touch + mouse controls (handle touchstart/move/end and mouse events)
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Sound effects via Web Audio API (require user interaction first)
- Visual feedback and smooth animations
- Clear game states and win/lose conditions
- Reset/restart functionality
- Child-friendly design: bright colors, Comic Sans MS font, celebration animations

### Special Features (When Appropriate)
- **Theme support**: Sarah (pink/purple) and Finn (dark/cyan) themes using CSS variables
- **Educational audio**: Speech synthesis for learning games (see number-counting)
- **Device features**: Orientation/tilt controls (see marble-maze)
- **Keyboard controls**: For desktop gameplay (see rhythm-tap: D,F,J,K keys)

### Code Patterns
```javascript
// Game loop pattern (for Canvas games)
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Touch/mouse handling pattern
element.addEventListener('touchstart', handleStart, {passive: false});
element.addEventListener('mousedown', handleStart);
element.addEventListener('touchmove', handleMove, {passive: false});
element.addEventListener('mousemove', handleMove);

// Theme implementation (CSS variables)
:root[data-theme="sarah"] {
    --bg-1: #ff6ec7;
    --bg-2: #c77dff;
    --accent: #ff69b4;
}
:root[data-theme="finn"] {
    --bg-1: #0a0e27;
    --bg-2: #1a1f3a;
    --accent: #00ffff;
}
```

### Performance Best Practices
- Embed small libraries inline to avoid network requests
- Canvas API for complex graphics, CSS transforms for simple animations
- Object pooling for frequently created/destroyed entities
- Clean up listeners/timers: `clearInterval()`, `removeEventListener()`
- Use CSS custom properties for theming and consistency

## PWA Considerations
- Service worker (`sw.js`) caches featured games for offline play
- Update `CACHE_NAME` version when modifying cached files
- Test offline: DevTools > Network > Offline
- Use relative paths for all assets
- Icons: SVG format at 192px and 512px sizes

## Testing Checklist
1. **Cross-browser**: Chrome, Firefox, Safari (desktop & mobile)
2. **Touch controls**: Test on actual mobile devices
3. **Offline mode**: Verify cached games work without network
4. **Responsive**: Test 320px to 1920px widths
5. **Performance**: 60 FPS target, check with DevTools Performance tab

## Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Games won't load offline | Add to `urlsToCache` in `sw.js` |
| Touch controls not working | Add touch event listeners alongside mouse |
| Audio won't play | Require user interaction before `AudioContext` |
| Layout breaks on mobile | Check viewport meta, use relative units |
| Service worker not updating | Change `CACHE_NAME` version |

## Agent Configuration
The project includes a specialized HTML game developer agent at `.claude/agents/html-game-developer.md` for creating new games following established patterns and best practices.