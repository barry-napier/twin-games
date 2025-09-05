# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Twin Games Collection is a PWA featuring educational games for children. All games are client-side HTML5/CSS/JavaScript with no backend dependencies.

## Architecture

### Two Game Development Patterns
1. **Self-contained** (most games): Single `index.html` with embedded CSS/JavaScript
2. **Modular** (bubble-pop): Separate HTML, CSS, JavaScript files

### Key Files
- `index.html` - Main game launcher/landing page
- `sw.js` - Service worker for PWA offline functionality  
- `manifest.json` - PWA configuration
- Individual game directories contain standalone games

## Development Commands
No build process required - this is a static site. For development:
- Use VS Code Live Server (configured on port 5501)
- Or any static file server: `python3 -m http.server` or `npx serve`
- Games run directly in browser without compilation

## Adding New Games

1. Create new directory at root level
2. Follow existing patterns:
   - For simple games: Single self-contained `index.html`
   - For complex games: Separate HTML/CSS/JS files
3. Update main `index.html` to add game to launcher grid
4. Update `sw.js` cache list if game should work offline

## Game Development Guidelines

### Essential Features for All Games
- Touch controls for mobile devices
- Responsive design (viewport meta tag, flexible layouts)
- Sound effects using Web Audio API
- Visual feedback and animations
- Clear win/lose conditions
- Reset/restart functionality

### Code Patterns
- Use `requestAnimationFrame` for game loops
- Handle both mouse and touch events
- Include viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Implement proper cleanup when game ends
- Use CSS custom properties for theming

### Performance
- Minimize external dependencies (embed small libraries if needed)
- Use Canvas API for complex graphics, CSS for simple animations
- Implement object pooling for frequently created/destroyed entities
- Clean up event listeners and intervals/timeouts

## PWA Considerations
- Service worker caches games for offline play
- When modifying cached files, update service worker version
- Test offline functionality after changes
- Ensure all assets are referenced with relative paths

## Testing Approach
Manual testing in browser:
1. Desktop: Chrome, Firefox, Safari
2. Mobile: iOS Safari, Chrome Android
3. Test offline mode (DevTools > Network > Offline)
4. Test touch controls on mobile/tablet
5. Verify responsive design at different screen sizes

## Common Troubleshooting
- If games don't load offline: Check service worker cache list in `sw.js`
- If touch controls fail: Ensure `touchstart`, `touchmove`, `touchend` events are handled
- If audio doesn't play: User interaction required before audio playback (click/tap to start)
- If layout breaks: Check viewport meta tag and use flexible units (%, vw/vh, rem)