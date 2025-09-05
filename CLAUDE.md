# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Twin Games Collection is a Progressive Web Application (PWA) featuring educational and entertainment games for children named Sarah & Finn. All games are client-side HTML5/CSS/JavaScript with no backend dependencies.

## Architecture

### Two Game Development Patterns
1. **Self-contained** (24 games): Single `index.html` with embedded CSS/JavaScript (357-1835 lines)
2. **Modular** (bubble-pop only): Separate HTML, CSS, JavaScript files with local manifest

### Key Files
- `index.html` - Main game launcher with 4 featured games grid
- `sw.js` - Service worker for offline functionality (caches main games)
- `manifest.json` - PWA configuration for app-like experience
- `icon-192.svg`, `icon-512.svg` - App icons
- Individual game directories - Standalone games at root level

### Current Game Status
**Featured/Cached Games:**
- marble-maze - Device tilt marble navigation
- rhythm-tap - Music rhythm game
- color-chain - Chain reaction strategy
- space-defender - Tower defense in space

**Additional Games** (21 directories in various completion states):
alphabet-adventure, animal-sounds, balloon-pop, bubble-pop, catch-a-critter, color-match, drawing-canvas, memory-cards, number-counting, shape-puzzle, and others

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
- Theme support for Sarah/Finn personalization (when appropriate)

### Code Patterns
```javascript
// Game loop pattern
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Touch/mouse handling
element.addEventListener('touchstart', handleStart);
element.addEventListener('mousedown', handleStart);
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