// Set Current Date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', dateOptions);

    // Music Player Logic
    const audioEl = document.getElementById('radio-audio');
    const nowPlayingText = document.getElementById('now-playing-text');
    const volumeSlider = document.getElementById('volume-slider');
    
    let isPlaying = false;
    let currentTrackIndex = 0;
    let tracks = []; // Will be populated by the API

    // Fetch live Jazz stations from Radio Browser API
    async function fetchRadioStations() {
        nowPlayingText.textContent = "Tuning into worldwide frequencies...";
        try {
            // Fetch top jazz stations, HTTPS only to ensure browser playback
            const response = await fetch('https://de1.api.radio-browser.info/json/stations/search?tag=jazz&limit=20&order=clickcount&reverse=true&hidebroken=true&is_https=true');
            const data = await response.json();
            
            if (data && data.length > 0) {
                tracks = data.map(station => ({
                    title: station.name.trim() || "Unknown Jazz Station",
                    url: station.url_resolved
                }));
                nowPlayingText.textContent = "Frequencies acquired. Ready.";
                loadTrack(currentTrackIndex);
            } else {
                throw new Error("No stations found");
            }
        } catch (error) {
            console.error("Radio API Error:", error);
            nowPlayingText.textContent = "API offline. Using backup records.";
            // Fallback list of reliable HTTPS jazz/vintage streams
            tracks = [
                { title: "Crooner Radio (Classic Vocal Jazz)", url: "https://whsh4u-panel.com/proxy/wz651475?mp=/stream" },
                { title: "Illinois Lounge (Vintage Space-Age)", url: "https://ice1.somafm.com/illstreet-128-mp3" },
                { title: "Secret Agent (Retro Spy/Jazz)", url: "https://ice1.somafm.com/secretagent-128-mp3" }
            ];
            loadTrack(currentTrackIndex);
        }
    }

    function loadTrack(index) {
        if (tracks.length === 0) return;
        
        audioEl.src = tracks[index].url;
        audioEl.volume = volumeSlider.value;
        nowPlayingText.textContent = `Tuning to: ${tracks[index].title}...`;
        audioEl.load();
    }

    // Add error handling for broken streams
    audioEl.addEventListener('error', (e) => {
        console.error("Audio source error:", e);
        nowPlayingText.textContent = "Static... frequency lost. Try next.";
        isPlaying = false;
    });

    audioEl.addEventListener('playing', () => {
        nowPlayingText.textContent = `Live: ${tracks[currentTrackIndex].title}`;
    });

    function playAudio() {
        if (tracks.length === 0) return;
        if (!audioEl.src) loadTrack(currentTrackIndex);
        audioEl.play().then(() => {
            isPlaying = true;
        }).catch(e => {
            console.error("Audio playback failed:", e);
            nowPlayingText.textContent = "Error tuning signal.";
        });
    }

    function pauseAudio() {
        audioEl.pause();
        isPlaying = false;
        if (tracks.length > 0) {
            nowPlayingText.textContent = `Paused: ${tracks[currentTrackIndex].title}`;
        }
    }

    function nextAudio() {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playAudio();
    }

    function prevAudio() {
        if (tracks.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playAudio();
    }
    
    function setVolume(val) {
        audioEl.volume = val;
    }

    // Initial fetch
    fetchRadioStations();

    // Random Quotes Logic
    // Random Quotes Logic
    const quotes = [
        { text: "The details are not the details. They make the design.", author: "Charles Eames" },
        { text: "Have nothing in your house that you do not know to be useful, or believe to be beautiful.", author: "William Morris" },
        { text: "To send light into the darkness of men's hearts - such is the duty of the artist.", author: "Robert Schumann" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "A thing of beauty is a joy for ever.", author: "John Keats" }
    ];

    function generateQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        document.getElementById('quote-display').textContent = `"${quote.text}"`;
        document.getElementById('quote-author').textContent = `- ${quote.author}`;
    }

    // Random Picture Logic
    const photographers = ["Ansel Adams", "Dorothea Lange", "Henri Cartier-Bresson", "Alfred Stieglitz", "Margaret Bourke-White", "Unknown Explorer"];

    function loadNewPicture() {
        const img = document.getElementById('vintage-pic');
        const credit = document.getElementById('photo-credit');
        // Adding random param to bypass cache
        img.src = `https://picsum.photos/400/300?grayscale&random=${Math.random()}`;
        
        // Pick a random historical photographer name
        const randomPhotographer = photographers[Math.floor(Math.random() * photographers.length)];
        credit.textContent = `Photograph by ${randomPhotographer}`;
    }

    // Analog Clock Logic
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    function setClock() {
        const currentDate = new Date();
        
        const secondsRatio = currentDate.getSeconds() / 60;
        const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
        const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;

        setRotation(secondHand, secondsRatio);
        setRotation(minuteHand, minutesRatio);
        setRotation(hourHand, hoursRatio);
    }

    function setRotation(element, rotationRatio) {
        element.style.transform = `translateX(-50%) rotate(${rotationRatio * 360}deg)`;
    }

    setInterval(setClock, 1000);
    setClock(); // Initial call