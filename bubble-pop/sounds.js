// Web Audio API for sound effects
let audioContext;
let backgroundMusic;
let musicGainNode;

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain node for background music
        musicGainNode = audioContext.createGain();
        musicGainNode.gain.value = 0.3; // Set volume to 30%
        musicGainNode.connect(audioContext.destination);
    }
}

// Play pop sound effect
function playPopSound(isRainbow = false) {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isRainbow) {
        // Special sound for rainbow bubbles - ascending arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, High C
        let noteIndex = 0;
        
        const playNote = () => {
            if (noteIndex < notes.length) {
                oscillator.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime + noteIndex * 0.05);
                noteIndex++;
            }
        };
        
        oscillator.type = 'sine';
        for (let i = 0; i < notes.length; i++) {
            setTimeout(playNote, i * 50);
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else {
        // Normal pop sound - quick chirp
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Play background music
function playBackgroundMusic() {
    initAudio();
    
    if (backgroundMusic) {
        backgroundMusic.stop();
    }
    
    // Create a simple looping melody
    const playMelody = () => {
        if (!gameState.musicEnabled) return;
        
        const notes = [
            { freq: 261.63, duration: 0.25 }, // C
            { freq: 293.66, duration: 0.25 }, // D
            { freq: 329.63, duration: 0.25 }, // E
            { freq: 261.63, duration: 0.25 }, // C
            { freq: 261.63, duration: 0.25 }, // C
            { freq: 293.66, duration: 0.25 }, // D
            { freq: 329.63, duration: 0.25 }, // E
            { freq: 261.63, duration: 0.25 }, // C
            { freq: 329.63, duration: 0.25 }, // E
            { freq: 349.23, duration: 0.25 }, // F
            { freq: 392.00, duration: 0.5 },  // G
            { freq: 329.63, duration: 0.25 }, // E
            { freq: 349.23, duration: 0.25 }, // F
            { freq: 392.00, duration: 0.5 }   // G
        ];
        
        let currentTime = audioContext.currentTime;
        
        notes.forEach(note => {
            const oscillator = audioContext.createOscillator();
            const noteGain = audioContext.createGain();
            
            oscillator.connect(noteGain);
            noteGain.connect(musicGainNode);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            
            noteGain.gain.setValueAtTime(0, currentTime);
            noteGain.gain.linearRampToValueAtTime(0.1, currentTime + 0.01);
            noteGain.gain.linearRampToValueAtTime(0.1, currentTime + note.duration - 0.01);
            noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Loop the melody
        setTimeout(playMelody, notes.reduce((sum, note) => sum + note.duration, 0) * 1000);
    };
    
    playMelody();
}

// Stop background music
function stopBackgroundMusic() {
    gameState.musicEnabled = false;
}