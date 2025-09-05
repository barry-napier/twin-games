// Game state
const gameState = {
    score: 0,
    bubbles: [],
    particles: [],
    baseSpeed: 1,
    currentSpeed: 1,
    speedIncrease: 0.1,
    scoreThreshold: 100,
    lastSpeedIncrease: 0,
    soundEnabled: true,
    musicEnabled: false,
    isRunning: false
};

// Bubble configuration
const BUBBLE_CONFIG = {
    minRadius: 25,
    maxRadius: 40,
    colors: [
        { color: '#FF6B6B', points: 10, weight: 30 },  // Red
        { color: '#4ECDC4', points: 15, weight: 25 },  // Teal
        { color: '#FFD93D', points: 20, weight: 20 },  // Yellow
        { color: '#6BCB77', points: 25, weight: 15 },  // Green
        { color: '#FF8CC3', points: 30, weight: 8 },   // Pink
        { color: 'rainbow', points: 50, weight: 2 }    // Rainbow (special)
    ],
    spawnRate: 1000, // milliseconds
    minSpawnRate: 500
};

// Canvas setup
let canvas, ctx;
let lastTime = 0;
let spawnTimer = 0;

// Bubble class
class Bubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * (BUBBLE_CONFIG.maxRadius - BUBBLE_CONFIG.minRadius) + BUBBLE_CONFIG.minRadius;
        this.speed = (Math.random() * 0.5 + 0.5) * gameState.currentSpeed;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.opacity = 0.8;
        
        // Select bubble type based on weights
        const totalWeight = BUBBLE_CONFIG.colors.reduce((sum, c) => sum + c.weight, 0);
        let random = Math.random() * totalWeight;
        let colorConfig = BUBBLE_CONFIG.colors[0];
        
        for (const config of BUBBLE_CONFIG.colors) {
            random -= config.weight;
            if (random <= 0) {
                colorConfig = config;
                break;
            }
        }
        
        this.color = colorConfig.color;
        this.points = colorConfig.points;
        this.isRainbow = colorConfig.color === 'rainbow';
        
        // Add shimmer effect
        this.shimmer = 0;
        this.shimmerSpeed = Math.random() * 0.05 + 0.02;
    }
    
    update(deltaTime) {
        this.y -= this.speed * deltaTime * 0.06;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;
        this.shimmer += this.shimmerSpeed;
        
        // Remove bubble if it goes off screen
        if (this.y < -this.radius * 2) {
            return false;
        }
        return true;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Draw bubble shadow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x + 3, this.y + 3, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw main bubble
        ctx.globalAlpha = this.opacity;
        
        if (this.isRainbow) {
            // Create rainbow gradient
            const gradient = ctx.createRadialGradient(
                this.x - this.radius / 3, this.y - this.radius / 3, 0,
                this.x, this.y, this.radius
            );
            
            const time = Date.now() / 1000;
            const colors = [
                `hsl(${(time * 50) % 360}, 100%, 50%)`,
                `hsl(${(time * 50 + 60) % 360}, 100%, 50%)`,
                `hsl(${(time * 50 + 120) % 360}, 100%, 50%)`,
                `hsl(${(time * 50 + 180) % 360}, 100%, 50%)`,
                `hsl(${(time * 50 + 240) % 360}, 100%, 50%)`,
                `hsl(${(time * 50 + 300) % 360}, 100%, 50%)`
            ];
            
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(0.2, colors[1]);
            gradient.addColorStop(0.4, colors[2]);
            gradient.addColorStop(0.6, colors[3]);
            gradient.addColorStop(0.8, colors[4]);
            gradient.addColorStop(1, colors[5]);
            
            ctx.fillStyle = gradient;
        } else {
            // Create gradient for normal bubbles
            const gradient = ctx.createRadialGradient(
                this.x - this.radius / 3, this.y - this.radius / 3, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.3, this.color);
            gradient.addColorStop(1, this.color);
            ctx.fillStyle = gradient;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw highlight
        ctx.globalAlpha = 0.6 + Math.sin(this.shimmer) * 0.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius / 3,
            this.y - this.radius / 3,
            this.radius / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw sparkles for rainbow bubbles
        if (this.isRainbow) {
            ctx.globalAlpha = 0.8;
            const sparkleCount = 6;
            for (let i = 0; i < sparkleCount; i++) {
                const angle = (Math.PI * 2 / sparkleCount) * i + this.shimmer;
                const sparkleX = this.x + Math.cos(angle) * this.radius * 0.7;
                const sparkleY = this.y + Math.sin(angle) * this.radius * 0.7;
                
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
    
    checkClick(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.radius;
    }
}

// Initialize game
function init() {
    canvas = document.getElementById('bubble-canvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Input handlers
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);
    
    // Settings handlers
    document.getElementById('settings-btn').addEventListener('click', toggleSettings);
    document.getElementById('close-settings').addEventListener('click', toggleSettings);
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        gameState.soundEnabled = e.target.checked;
    });
    document.getElementById('music-toggle').addEventListener('change', (e) => {
        gameState.musicEnabled = e.target.checked;
        if (e.target.checked) {
            playBackgroundMusic();
        } else {
            stopBackgroundMusic();
        }
    });
    
    // Hide loading screen and start game
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        gameState.isRunning = true;
        gameLoop(0);
    }, 1500);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('hidden');
}

// Input handling
function handleClick(e) {
    handleInput(e.clientX, e.clientY);
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
    // Check if any bubble was clicked
    for (let i = gameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = gameState.bubbles[i];
        if (bubble.checkClick(x, y)) {
            popBubble(bubble, i);
            break; // Only pop one bubble per click
        }
    }
}

// Pop bubble with effects
function popBubble(bubble, index) {
    // Update score
    gameState.score += bubble.points;
    updateScore();
    
    // Play pop sound
    if (gameState.soundEnabled) {
        playPopSound(bubble.isRainbow);
    }
    
    // Create pop effect
    createPopEffect(bubble.x, bubble.y, bubble.points, bubble.color);
    
    // Create particles
    createParticles(bubble.x, bubble.y, bubble.color, bubble.radius);
    
    // Remove bubble
    gameState.bubbles.splice(index, 1);
    
    // Check for speed increase
    checkSpeedIncrease();
}

function createPopEffect(x, y, points, color) {
    const popScore = document.createElement('div');
    popScore.className = 'pop-score';
    popScore.textContent = `+${points}`;
    popScore.style.left = `${x}px`;
    popScore.style.top = `${y}px`;
    
    if (color === 'rainbow') {
        popScore.style.background = 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD93D, #6BCB77)';
        popScore.style.webkitBackgroundClip = 'text';
        popScore.style.webkitTextFillColor = 'transparent';
        popScore.style.fontSize = '48px';
    }
    
    document.getElementById('pop-effects').appendChild(popScore);
    
    setTimeout(() => {
        popScore.remove();
    }, 1000);
}

function createParticles(x, y, color, radius) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'pop-particle';
        
        const angle = (Math.PI * 2 / particleCount) * i;
        const distance = radius * 2;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = color === 'rainbow' ? 
            `hsl(${Math.random() * 360}, 100%, 50%)` : color;
        
        document.getElementById('pop-effects').appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = gameState.score;
    scoreElement.style.animation = 'none';
    setTimeout(() => {
        scoreElement.style.animation = 'score-bounce 0.3s ease';
    }, 10);
}

function checkSpeedIncrease() {
    const threshold = Math.floor(gameState.score / gameState.scoreThreshold);
    if (threshold > gameState.lastSpeedIncrease) {
        gameState.lastSpeedIncrease = threshold;
        gameState.currentSpeed = gameState.baseSpeed + (threshold * gameState.speedIncrease);
        
        // Increase spawn rate slightly
        const currentSpawnRate = BUBBLE_CONFIG.spawnRate - (threshold * 50);
        BUBBLE_CONFIG.spawnRate = Math.max(currentSpawnRate, BUBBLE_CONFIG.minSpawnRate);
    }
}

// Spawn bubbles
function spawnBubble() {
    const margin = BUBBLE_CONFIG.maxRadius;
    const x = Math.random() * (canvas.width - margin * 2) + margin;
    const y = canvas.height + BUBBLE_CONFIG.maxRadius;
    
    gameState.bubbles.push(new Bubble(x, y));
}

// Game loop
function gameLoop(currentTime) {
    if (!gameState.isRunning) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Spawn bubbles
    spawnTimer += deltaTime;
    if (spawnTimer >= BUBBLE_CONFIG.spawnRate) {
        spawnBubble();
        spawnTimer = 0;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw bubbles
    for (let i = gameState.bubbles.length - 1; i >= 0; i--) {
        const bubble = gameState.bubbles[i];
        if (!bubble.update(deltaTime)) {
            gameState.bubbles.splice(i, 1);
        } else {
            bubble.draw(ctx);
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game when page loads
window.addEventListener('load', init);