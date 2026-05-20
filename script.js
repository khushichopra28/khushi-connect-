/* =============================================
   KHUSHI CHOPRA PORTFOLIO — script.js
   Red Noir — Interactions & Animations
   ============================================= */

// ============================================================
// 1. CUSTOM CURSOR (Deactivated)
// ============================================================
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursor && ring) {
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    });

    // Smooth-lag ring animation
    const animateRing = () => {
        rx += (mx - rx - 18) * 0.12;
        ry += (my - ry - 18) * 0.12;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
        requestAnimationFrame(animateRing);
    };
    animateRing();

    // Scale ring on interactive elements
    document.querySelectorAll('a, button, .skill-pill, .role-item, .shiny-cta, .ghost-cta, .nav-cta-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width      = '60px';
            ring.style.height     = '60px';
            ring.style.opacity    = '0.5';
            ring.style.marginLeft = '-12px';
            ring.style.marginTop  = '-12px';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width      = '36px';
            ring.style.height     = '36px';
            ring.style.opacity    = '1';
            ring.style.marginLeft = '0';
            ring.style.marginTop  = '0';
        });
    });
}


// ============================================================
// 2. MATRIX RAIN CANVAS (Experience Section Background)
// ============================================================
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const expSection = canvas.parentElement;

    function resizeCanvas() {
        canvas.width = expSection.offsetWidth;
        canvas.height = expSection.offsetHeight;
    }
    resizeCanvas();

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ∇∆∞≡≈±∓⊕⊗';
    let cols = Math.floor(canvas.width / 20);
    let drops = Array(cols).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(214, 51, 132, 0.8)';
        ctx.font = '13px Space Mono, monospace';

        drops.forEach((y, i) => {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(ch, i * 20, y * 20);

            if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    setInterval(drawMatrix, 60);

    window.addEventListener('resize', () => {
        resizeCanvas();
        cols = Math.floor(canvas.width / 20);
        drops = Array(cols).fill(1);
    });
}


// ============================================================
// 3. SCROLL REVEAL
// ============================================================
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const idx   = Array.from(reveals).indexOf(e.target);
            const delay = 80 * (idx % 4);
            setTimeout(() => e.target.classList.add('visible'), delay);
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// Cyber cards hover glow & tilt tracking
document.querySelectorAll('.cyber-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const xVal = e.clientX - rect.left;
        const yVal = e.clientY - rect.top;
        
        // Background glow positioning
        const pctX = (xVal / rect.width) * 100;
        const pctY = (yVal / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${pctX}%`);
        card.style.setProperty('--mouse-y', `${pctY}%`);

        // 3D Tilt calculation
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((yVal - cy) / cy) * -6;
        const rotY = ((xVal - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// ============================================================
// 3. 3D TILT ON CARDS
// ============================================================
document.querySelectorAll('.tilt-card').forEach(card => {

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const cx   = rect.width  / 2;
        const cy   = rect.height / 2;

        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) *  8;

        card.style.transform =
            `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;

        // Spotlight gradient for project cards
        if (card.classList.contains('project-card')) {
            const px = ((x / rect.width)  * 100).toFixed(1);
            const py = ((y / rect.height) * 100).toFixed(1);
            card.style.setProperty('--mx', px + '%');
            card.style.setProperty('--my', py + '%');
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform =
            'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});


// ============================================================
// 4. STAGGER DELAY — TIMELINE ITEMS
// ============================================================
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.05}s`;
});


// ============================================================
// 5. CONTACT FORM — SUBMIT HANDLER (UI feedback only)
// ============================================================
const sendBtn = document.querySelector('.contact-form .btn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const name    = document.querySelector('.contact-form input[type="text"]').value.trim();
        const email   = document.querySelector('.contact-form input[type="email"]').value.trim();
        const message = document.querySelector('.contact-form textarea').value.trim();

        if (!name || !email || !message) {
            sendBtn.textContent = 'Fill all fields ✕';
            sendBtn.style.borderColor = '#ff2d78';
            sendBtn.style.color       = '#ff2d78';
            setTimeout(() => {
                sendBtn.textContent       = 'Send Message';
                sendBtn.style.borderColor = '';
                sendBtn.style.color       = '';
            }, 2000);
            return;
        }

        sendBtn.textContent = 'Connecting...';
        sendBtn.disabled = true;

        fetch("https://formsubmit.co/ajax/khushichopra.m@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            sendBtn.textContent = 'Sent ✓';
            sendBtn.style.borderColor = '#d63384';
            sendBtn.style.color       = '#d63384';
            // Clear fields on success
            document.querySelector('.contact-form input[type="text"]').value = "";
            document.querySelector('.contact-form input[type="email"]').value = "";
            document.querySelector('.contact-form textarea').value = "";
            
            setTimeout(() => {
                sendBtn.textContent       = 'Send Message';
                sendBtn.style.borderColor = '';
                sendBtn.style.color       = '';
                sendBtn.disabled          = false;
            }, 3000);
        })
        .catch(err => {
            console.error("Mail send error:", err);
            sendBtn.textContent = 'Error ✕';
            sendBtn.style.borderColor = '#ff2d78';
            sendBtn.style.color       = '#ff2d78';
            setTimeout(() => {
                sendBtn.textContent       = 'Send Message';
                sendBtn.style.borderColor = '';
                sendBtn.style.color       = '';
                sendBtn.disabled          = false;
            }, 3000);
        });
    });
}


// ============================================================
// 6. ACTIVE NAV HIGHLIGHT ON SCROLL
// ============================================================
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.style.color = '');
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.style.color = 'white';
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));


// ============================================================
// 7. NAVBAR AUTO-HIDE ON SCROLL
// ============================================================
let lastScrollY = window.scrollY;
const navHeader = document.querySelector('.nav-header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navHeader.style.transform = 'translateY(-120%)';
        navHeader.style.transition = 'transform 0.4s ease';
    } else {
        navHeader.style.transform = 'translateY(0)';
        navHeader.style.transition = 'transform 0.4s ease';
    }
    lastScrollY = currentScrollY;
}, { passive: true });


// ============================================================
// 8. CYBER DECRYPTOR INTERACTIVE SHOWCASE (GRAPHIC & SECURITY)
// ============================================================
function initCyberDecryptor() {
    const container = document.getElementById('cyber-decryptor');
    const tracker = document.getElementById('hud-tracker');
    const matrixOverlay = document.getElementById('hud-matrix-overlay');
    const statusText = document.getElementById('hud-decrypt-status');

    if (!container) return;

    // 1. Generate Matrix Code Overlay
    if (matrixOverlay) {
        let gridHtml = '';
        const hexChars = '0123456789ABCDEF@#$%&*';
        for (let i = 0; i < 96; i++) {
            const char = hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)];
            gridHtml += `<span class="matrix-cell" style="opacity: ${Math.random().toFixed(2)}; transition: all 0.3s;">${char}</span>`;
        }
        matrixOverlay.innerHTML = gridHtml;

        const interval = setInterval(() => {
            const cells = matrixOverlay.querySelectorAll('.matrix-cell');
            cells.forEach(cell => {
                if (Math.random() > 0.8) {
                    const char = hexChars[Math.floor(Math.random() * hexChars.length)] + hexChars[Math.floor(Math.random() * hexChars.length)];
                    cell.textContent = char;
                    cell.style.opacity = Math.random().toFixed(2);
                }
            });
        }, 120);
        matrixOverlay.dataset.intervalId = interval;
    }

    // 2. Decrypt on Viewport Entrance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                container.classList.add('decrypting');
                if (statusText) statusText.textContent = '[STATUS: DECRYPTING...]';

                setTimeout(() => {
                    container.classList.remove('decrypting');
                    container.classList.add('decrypted');
                    if (statusText) statusText.textContent = '[STATUS: ACCESS_GRANTED]';

                    if (matrixOverlay && matrixOverlay.dataset.intervalId) {
                        clearInterval(parseInt(matrixOverlay.dataset.intervalId));
                    }
                }, 2800);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(container);

    // 3. HUD Target Tracking Coordinates
    if (tracker) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);

            tracker.style.left = `${x}px`;
            tracker.style.top = `${y}px`;

            const coords = tracker.querySelector('.tracker-coords');
            if (coords) {
                coords.textContent = `X: ${String(x).padStart(3, '0')} Y: ${String(y).padStart(3, '0')}`;
            }
        });
    }
}


// ============================================================
// 9. SMOOTH PARALLAX EFFECT FOR HERO
// ============================================================
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrolled < heroHeight) {
            const opacity = 1 - (scrolled / heroHeight) * 0.5;
            const translateY = scrolled * 0.3;
            heroSection.querySelector('.hero-center').style.transform = `translateY(${translateY}px)`;
            heroSection.querySelector('.hero-center').style.opacity = opacity;
        }
    }, { passive: true });
}

// ============================================================
// 10. POINTER HIGHLIGHT ANIMATION (VANILLA JS PORT)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const phContainer = document.getElementById("ph-container");
    const phBox = document.querySelector(".ph-box");
    const phCursorWrap = document.querySelector(".ph-cursor-wrap");

    if (phContainer && phBox && phCursorWrap) {
        let hasAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // start animating when the container is fully visible
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    // Give a small delay so user notices it drawing
                    setTimeout(() => {
                        const rect = phContainer.getBoundingClientRect();
                        
                        // Fade in and expand box
                        phBox.style.opacity = "1";
                        phBox.style.width = `${rect.width}px`;
                        phBox.style.height = `${rect.height}px`;

                        // Move cursor
                        setTimeout(() => {
                            phCursorWrap.style.opacity = "1";
                            phCursorWrap.style.transform = `translate(${rect.width + 4}px, ${rect.height + 4}px)`;
                        }, 100);
                    }, 500);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        observer.observe(phContainer);
    }
});

// ============================================================
// 11. POINTER TESTIMONIALS CAROUSEL
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll('.stagger-card'));
    const prevBtn = document.getElementById('stagger-prev');
    const nextBtn = document.getElementById('stagger-next');
    
    if (cards.length > 0) {
        let cardOrder = cards.map((_, i) => i);
        
        function updateCards() {
            const isDesktop = window.innerWidth >= 640;
            const cardSize = isDesktop ? 365 : 290;
            const len = cardOrder.length;
            
            cardOrder.forEach((originalIndex, currentIndex) => {
                const card = cards[originalIndex];
                
                // For a 6 element array, index 3 is center (0).
                const position = (len % 2 !== 0) 
                    ? currentIndex - Math.floor(len / 2)
                    : currentIndex - (len / 2);
                    
                const isCenter = position === 0;
                
                if (isCenter) {
                    card.classList.add('is-center');
                } else {
                    card.classList.remove('is-center');
                }
                
                const translateX = (cardSize / 1.5) * position;
                const translateY = isCenter ? -65 : (position % 2 !== 0 ? 15 : -15);
                const rotate = isCenter ? 0 : (position % 2 !== 0 ? 2.5 : -2.5);
                
                card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`;
                
                if (isCenter) {
                    card.style.zIndex = 20;
                } else {
                    card.style.zIndex = Math.max(0, 10 - Math.abs(position));
                }
            });
        }
        
        function handleMove(steps) {
            let newOrder = [...cardOrder];
            if (steps > 0) {
                // shift left (next)
                for (let i = 0; i < steps; i++) {
                    const item = newOrder.shift();
                    newOrder.push(item);
                }
            } else {
                // shift right (prev)
                for (let i = 0; i < -steps; i++) {
                    const item = newOrder.pop();
                    newOrder.unshift(item);
                }
            }
            cardOrder = newOrder;
            updateCards();
        }
        
        if (prevBtn) prevBtn.addEventListener('click', () => handleMove(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => handleMove(1));
        
        cards.forEach((card, originalIndex) => {
            card.addEventListener('click', () => {
                const currentIndex = cardOrder.indexOf(originalIndex);
                const len = cardOrder.length;
                const position = (len % 2 !== 0) 
                    ? currentIndex - Math.floor(len / 2)
                    : currentIndex - (len / 2);
                
                if (position !== 0) {
                    handleMove(position);
                }
            });
        });

        window.addEventListener('resize', updateCards);
        updateCards();
    }
});

// ============================================================
// 12. COMMITS GRID COMPONENT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("commits-grid-container");
    if (!container) return;

    const letterPatterns = {
        C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
        K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
        // Adding space just in case, though not needed for "KC"
        " ": []
    };

    function cleanString(str) {
        const upperStr = str.toUpperCase();
        const withoutAccents = upperStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const allowedChars = Object.keys(letterPatterns);
        return withoutAccents.split("").filter((char) => allowedChars.includes(char)).join("");
    }

    function generateHighlightedCells(text) {
        const cleanedText = cleanString(text);
        const width = Math.max(cleanedText.length * 6, 6) + 1;
        let currentPosition = 1;
        const highlightedCells = [];

        cleanedText.toUpperCase().split("").forEach((char) => {
            if (letterPatterns[char]) {
                const pattern = letterPatterns[char].map((pos) => {
                    const row = Math.floor(pos / 50);
                    const col = pos % 50;
                    return (row + 1) * width + col + currentPosition;
                });
                highlightedCells.push(...pattern);
            }
            currentPosition += 6;
        });

        return { cells: highlightedCells, width, height: 9 };
    }

    const { cells, width, height } = generateHighlightedCells("KC");

    container.style.gridTemplateColumns = `repeat(${width}, minmax(0, 1fr))`;
    container.style.gridTemplateRows = `repeat(${height}, minmax(0, 1fr))`;

    const commitColors = ["#48d55d", "#016d32", "#0d4429"]; // GitHub Greens

    const totalCells = width * height;
    let htmlFragments = [];

    for (let i = 0; i < totalCells; i++) {
        const isHighlighted = cells.includes(i);
        const shouldFlash = !isHighlighted && (Math.random() < 0.3);
        const delay = (Math.random() * 0.6).toFixed(1) + "s";
        const color = commitColors[Math.floor(Math.random() * commitColors.length)];

        let classes = "commit-cell";
        if (isHighlighted) classes += " animate-highlight";
        if (shouldFlash) classes += " animate-flash";
        if (!isHighlighted && !shouldFlash) classes += " bg-card";

        htmlFragments.push(`
            <div class="${classes}" style="animation-delay: ${delay}; --highlight: ${color};"></div>
        `);
    }

    container.innerHTML = htmlFragments.join("");
});

// ============================================================
// 13. MUSIC PLAYER — (Integrated in life outside section at bottom)
// ============================================================

// ============================================================
// 14. FAQ ACCORDION
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const trigger = item.querySelector(".faq-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all items (single-open accordion behavior)
            faqItems.forEach((el) => el.classList.remove("active"));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
});

// ============================================================
// 15. DOTTED SURFACE BACKGROUND (THREE.JS)
// ============================================================
function initDottedSurface() {
    console.log("3D Surface: Attempting to initialize...");
    
    if (typeof THREE === 'undefined') {
        console.warn("3D Surface: Three.js not loaded. Retrying in 500ms...");
        setTimeout(initDottedSurface, 500);
        return;
    }

    const container = document.getElementById('dotted-surface-container');
    if (!container) {
        console.error("3D Surface: Container not found!");
        return;
    }

    const SEPARATION = 100;
    const AMOUNTX = 50;
    const AMOUNTY = 50;
    
    let scene, camera, renderer, geometry, material, points;
    let count = 0;
    let animationId = null;
    let isVisible = false;

    function init() {
        console.log("3D Surface: Initializing scene...");
        scene = new THREE.Scene();
        
        // Exact neon pink color, slightly softened so it doesn't glare
        const pinkColor = new THREE.Color(0xd63384); 
        const subtlePink = pinkColor.clone().lerp(new THREE.Color(0x000000), 0.2); 
        
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || 600;

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
        camera.position.set(0, 500, 1200);
        camera.lookAt(0, 0, 0);

        const positions = new Float32Array(AMOUNTX * AMOUNTY * 3);
        const colors = new Float32Array(AMOUNTX * AMOUNTY * 3);

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i * 3] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);

                colors[i * 3] = subtlePink.r;
                colors[i * 3 + 1] = subtlePink.g;
                colors[i * 3 + 2] = subtlePink.b;
                i++;
            }
        }

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        material = new THREE.PointsMaterial({
            size: 6,
            vertexColors: true,
            transparent: true,
            opacity: 0.7, // Slightly increased
            sizeAttenuation: true
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); 
        
        // Remove existing canvas if any
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        console.log("3D Surface: Canvas appended. Size:", width, "x", height);

        window.addEventListener('resize', onWindowResize);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                console.log("3D Surface: Visible?", isVisible);
                if (isVisible) {
                    if (!animationId) animate();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.01 });
        
        observer.observe(container);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function animate() {
        if (!isVisible) return;
        animationId = requestAnimationFrame(animate);
        render();
    }

    function render() {
        const positions = geometry.attributes.position.array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Wave logic from component
                positions[i * 3 + 1] = (Math.sin((ix + count) * 0.3) * 50) +
                                      (Math.sin((iy + count) * 0.5) * 50);
                i++;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.05; // Slightly slower for more "subtle" feel
    }

    init();
}

// ============================================================
// 16. RADIAL SCROLL GALLERY (PROCESS)
// ============================================================
function initRadialGallery() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP not loaded. Retrying in 500ms...");
        setTimeout(initRadialGallery, 500);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('process');
    const container = document.querySelector('.radial-sticky-container');
    const wheel = document.getElementById('radial-wheel');
    const items = document.querySelectorAll('.radial-item');
    
    if (!section || !wheel || !items.length) return;

    // Use smaller radius on mobile, larger on desktop
    const baseRadius = window.innerWidth < 768 ? 220 : 350;
    const scrollDuration = 1500;
    const visiblePercentage = 55;
    
    // Calculate visible and hidden decimal ranges
    const visibleDecimal = visiblePercentage / 100;
    const hiddenDecimal = 1 - visibleDecimal;
    const circleDiameter = baseRadius * 2;

    // Set wheel dimensions
    wheel.style.width = `${circleDiameter}px`;
    wheel.style.height = `${circleDiameter}px`;
    wheel.style.bottom = `-${circleDiameter * hiddenDecimal}px`;

    const childrenCount = items.length;

    // Position items in a circle
    items.forEach((item, index) => {
        const angle = (index / childrenCount) * 2 * Math.PI;
        const x = baseRadius * Math.cos(angle);
        const y = baseRadius * Math.sin(angle);
        const rotationAngle = (angle * 180) / Math.PI;

        // Position using translate3d & rotate
        item.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotationAngle + 90}deg)`;
    });

    // Approximate container height buffer so cards are not clipped
    const visibleAreaHeight = circleDiameter * visibleDecimal + 200;
    container.style.height = `${visibleAreaHeight}px`;

    // Hover state management
    const processCards = document.querySelectorAll('.process-card');
    processCards.forEach(card => {
        card.addEventListener('mouseenter', () => wheel.classList.add('is-hovering'));
        card.addEventListener('mouseleave', () => wheel.classList.remove('is-hovering'));
        card.addEventListener('focus', () => wheel.classList.add('is-hovering'));
        card.addEventListener('blur', () => wheel.classList.remove('is-hovering'));
    });

    // Entrance Animation setup
    gsap.set(items, { scale: 0, autoAlpha: 0 });
    
    // Make wheel container visible
    wheel.style.opacity = '1';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Entrance animation
        gsap.to(items, {
            scale: 1,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            stagger: 0.05,
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            }
        });

        // Rotate wheel continuously on scroll
        gsap.to(wheel, {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
                trigger: section, // Pin the whole section to prevent footer overlap
                pin: true,
                start: 'center center',
                end: `+=${scrollDuration}`,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    } else {
        // Fallback for reduced motion
        gsap.set(items, { scale: 1, autoAlpha: 1 });
    }
}

// ============================================================
// 17. IMAGE SPOTLIGHTS
// ============================================================
function initSpotlights() {
    const spotlights = document.querySelectorAll('.spotlight-container');

    // Modal elements
    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    spotlights.forEach(container => {
        // Spotlight interaction
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            container.style.setProperty('--mouse-x', `${x}%`);
            container.style.setProperty('--mouse-y', `${y}%`);

            const rotateY = ((x - 50) / 50) * 8; // Left-right tilt
            const rotateX = ((50 - y) / 50) * 8; // Up-down tilt

            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        container.addEventListener('mouseleave', () => {
             // Reset back to center seamlessly
            container.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            container.style.setProperty('--mouse-x', '50%');
            container.style.setProperty('--mouse-y', '50%');
        });

        // Click interaction for Modal
        container.addEventListener('click', () => {
            const imgSrc = container.querySelector('.spotlight-base-img').src;
            const title = container.getAttribute('data-title');
            const desc = container.getAttribute('data-desc');

            if (modalImg) modalImg.src = imgSrc;
            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;

            if (modal) {
                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });

        // Accessibility triggers
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                container.click();
            }
        });
    });

    // Modal closing logic
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// ============================================================
// 18. ORBITING SKILLS
// ============================================================
function initOrbitingSkills() {
    const universe = document.getElementById('orbit-universe');
    if (!universe) return;

    const nodes = document.querySelectorAll('.orbit-node');
    let isPaused = false;
    let time = 0;
    
    // Config extraction
    const nodeConfigs = Array.from(nodes).map(node => {
        return {
            el: node,
            orbit: parseFloat(node.getAttribute('data-orbit') || '100'),
            speed: parseFloat(node.getAttribute('data-speed') || '1'),
            phase: parseFloat(node.getAttribute('data-phase') || '0')
        };
    });

    universe.addEventListener('mouseenter', () => isPaused = true);
    universe.addEventListener('mouseleave', () => isPaused = false);
    
    // Hover classes for isolated nodes
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => node.classList.add('is-hovered'));
        node.addEventListener('mouseleave', () => node.classList.remove('is-hovered'));
    });

    let lastTime = performance.now();

    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        if (!isPaused) {
            time += deltaTime;
        }

        nodeConfigs.forEach(config => {
            const angle = time * config.speed + config.phase;
            const x = Math.cos(angle) * config.orbit;
            const y = Math.sin(angle) * config.orbit;
            
            config.el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// ============================================================
// 19. FAQ LIGHT RAYS BACKGROUND (THREE.JS)
// ============================================================
function initFAQLightRays() {
    if (typeof THREE === 'undefined') {
        setTimeout(initFAQLightRays, 500);
        return;
    }

    const container = document.getElementById('faq-lightrays-container');
    if (!container) return;

    let scene, camera, renderer, material, mesh;
    let animationId = null;
    let isVisible = false;

    const raysColor = [214/255, 51/255, 132/255]; // --neon #d63384

    let mousePos = { x: 0.5, y: 0.5 };
    let smoothMouse = { x: 0.5, y: 0.5 };

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        precision highp float;
        uniform float iTime;
        uniform vec2  iResolution;
        uniform vec2  rayPos;
        uniform vec2  rayDir;
        uniform vec3  raysColor;
        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;
        uniform vec2  mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;
        varying vec2 vUv;

        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                          float seedA, float seedB, float speed) {
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord);
          float cosAngle = dot(dirNorm, rayRefDirection);
          
          float d = distortion * sin(iTime * 1.5 + length(sourceToCoord) * 0.005);
          float distortedAngle = cosAngle + d;
          
          float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
          float distance = length(sourceToCoord);
          float maxDistance = max(iResolution.x, iResolution.y) * rayLength;
          float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
          
          float fadeFactor = fadeDistance * max(iResolution.x, iResolution.y);
          float fadeFalloff = clamp((fadeFactor - distance) / fadeFactor, 0.0, 1.0);
          
          float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 4.0)) : 1.0;
          
          float baseStrength = clamp(
            (0.5 + 0.2 * sin(distortedAngle * seedA + iTime * speed)) +
            (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed * 0.8)),
            0.0, 1.0
          );
          
          return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
        }

        void main() {
          vec2 fragCoord = vUv * iResolution;
          vec2 coord = vec2(fragCoord.x, fragCoord.y);
          
          vec2 finalRayDir = normalize(rayDir);
          if (mouseInfluence > 0.0) {
            vec2 mouseScreenPos = mousePos * iResolution.xy;
            vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
            finalRayDir = normalize(mix(finalRayDir, mouseDirection, mouseInfluence));
          }

          float r1 = rayStrength(rayPos, finalRayDir, coord, 45.2, 31.4, 0.8 * raysSpeed);
          float r2 = rayStrength(rayPos, finalRayDir, coord, 28.5, 19.8, 1.2 * raysSpeed);
          float r3 = rayStrength(rayPos, finalRayDir, coord, 12.1, 56.2, 0.5 * raysSpeed);
          
          float combined = (r1 * 0.4 + r2 * 0.4 + r3 * 0.2);
          combined = pow(combined, 0.7); 
          combined *= 1.5; 
          vec3 finalColor = raysColor * combined;
          
          if (noiseAmount > 0.0) {
            float n = noise(coord * 0.01 + iTime * 0.05);
            finalColor *= (1.0 - noiseAmount + noiseAmount * n);
          }

          if (saturation != 1.0) {
            float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
            finalColor = mix(vec3(gray), finalColor, saturation);
          }

          gl_FragColor = vec4(finalColor, combined);
        }
    `;

    function init() {
        scene = new THREE.Scene();
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || 400;

        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(width * window.devicePixelRatio, height * window.devicePixelRatio) },
            rayPos: { value: new THREE.Vector2(0, 0) },
            rayDir: { value: new THREE.Vector2(0, -1) },
            raysColor: { value: new THREE.Vector3(...raysColor) },
            raysSpeed: { value: 1.5 },
            lightSpread: { value: 1.2 },
            rayLength: { value: 1.8 },
            pulsating: { value: 0.0 },
            fadeDistance: { value: 1.0 },
            saturation: { value: 1.0 },
            mousePos: { value: new THREE.Vector2(0.5, 0.5) },
            mouseInfluence: { value: 0.3 },
            noiseAmount: { value: 0.03 },
            distortion: { value: 0.08 }
        };

        const getAnchorAndDir = (w, h) => {
            const outside = 0.2;
            return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] }; 
        };

        material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        
        container.appendChild(renderer.domElement);

        function updatePlacement() {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight;
            renderer.setSize(width, height);
            
            const w = width * renderer.getPixelRatio();
            const h = height * renderer.getPixelRatio();
            
            material.uniforms.iResolution.value.set(w, h);
            const { anchor, dir } = getAnchorAndDir(w, h);
            material.uniforms.rayPos.value.set(anchor[0], anchor[1]);
            material.uniforms.rayDir.value.set(dir[0], dir[1]);
        }

        window.addEventListener('resize', updatePlacement);
        setTimeout(updatePlacement, 100);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    if (!animationId) animate(performance.now());
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.01 });
        
        observer.observe(container);

        container.parentElement.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mousePos.x = (e.clientX - rect.left) / rect.width;
            mousePos.y = (e.clientY - rect.top) / rect.height;
        });
    }

    function animate(time) {
        if (!isVisible) return;
        animationId = requestAnimationFrame(animate);
        
        material.uniforms.iTime.value = time * 0.001;
        
        const smoothing = 0.95;
        smoothMouse.x = smoothMouse.x * smoothing + mousePos.x * (1 - smoothing);
        smoothMouse.y = smoothMouse.y * smoothing + mousePos.y * (1 - smoothing);
        
        material.uniforms.mousePos.value.set(smoothMouse.x, 1.0 - smoothMouse.y);

        renderer.render(scene, camera);
    }

    init();
}

// ============================================================
// 17. HERO TAGLINE TEXT ROTATOR (VANILLA JS)
// ============================================================
function initTextRotator() {
    const rotator = document.querySelector('.text-rotator');
    if (!rotator) return;

    const words = rotator.querySelectorAll('.word');
    let currentIndex = 0;

    function updateSize() {
        const activeWord = words[currentIndex];
        if (!activeWord) return;

        // Measure width and height of active word
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        
        // Copy exact styles
        const computedStyle = window.getComputedStyle(activeWord);
        tempSpan.style.fontFamily = computedStyle.fontFamily;
        tempSpan.style.fontSize = computedStyle.fontSize;
        tempSpan.style.fontWeight = computedStyle.fontWeight;
        tempSpan.style.letterSpacing = computedStyle.letterSpacing;
        tempSpan.textContent = activeWord.textContent;
        
        document.body.appendChild(tempSpan);
        const rect = tempSpan.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        document.body.removeChild(tempSpan);

        rotator.style.width = `${width}px`;
        rotator.style.height = `${height}px`;
    }

    // Set initial size after short delay to ensure font files are rendered
    setTimeout(updateSize, 100);
    window.addEventListener('resize', updateSize);

    setInterval(() => {
        const currentWord = words[currentIndex];
        currentIndex = (currentIndex + 1) % words.length;
        const nextWord = words[currentIndex];

        currentWord.classList.remove('active');
        currentWord.classList.add('exit');

        nextWord.classList.remove('exit');
        nextWord.classList.add('active');

        updateSize();

        setTimeout(() => {
            currentWord.classList.remove('exit');
        }, 600); // matches CSS transition duration (0.6s)
    }, 2500);
}

// ============================================================
// 18. CYBER-TERMINAL DOSSIER DASHBOARD
// ============================================================
const EXPS_DATA = [
    {
        role: "Risk Management Intern",
        org: "Equitas Small Finance Bank",
        logo: "equi.avif",
        lor: "LOR EQUITAS.png",
        bullets: [
            "Assisted in identifying, assessing, and documenting operational and financial risk factors across banking workflows.",
            "Supported the team in preparing risk reports and compliance frameworks aligned with RBI guidelines.",
            "Gained hands-on exposure to real-world risk mitigation strategies in a regulated financial environment."
        ],
        skills: ["Risk Analysis", "Compliance", "Documentation", "Banking Domain"]
    },
    {
        role: "Event Coordinator & Event Lead",
        org: "Skillo DIY Crafts",
        logo: "skillo.webp",
        lor: "LOR SKILLO.png",
        bullets: [
            "Planned and executed end-to-end event logistics, coordinating speakers, timelines, and participant experience for craft and tech events.",
            "Led a team of volunteers, delegating tasks and ensuring seamless event operations under tight deadlines.",
            "Designed promotional materials and digital campaigns, boosting event reach and registrations."
        ],
        skills: ["Event Management", "Leadership", "Team Coordination", "Marketing"]
    },
    {
        role: "Design Member",
        org: "Developer Students Club",
        logo: "dsc.png",
        lor: null,
        bullets: [
            "Designed event posters, newsletters, and digital assets to strengthen DSC's brand identity across social platforms.",
            "Contributed to the official DSC website design in Figma, focusing on clean UI/UX and professional layout.",
            "Collaborated with the tech team on design-to-development handoff, bridging creative and engineering workflows."
        ],
        skills: ["Figma", "UI/UX", "Brand Design", "Collaboration"]
    },
    {
        role: "Member",
        org: "CCEE – Cybersecurity Excellence Center",
        logo: "ccee.png",
        lor: null,
        bullets: [
            "Engaged in cybersecurity workshops, CTF challenges, and peer-learning sessions focused on ethical hacking and network defense.",
            "Contributed to building awareness of security best practices within the student community.",
            "Explored topics in AI-driven security, threat modeling, and cloud security frameworks."
        ],
        skills: ["Ethical Hacking", "CTF", "Network Security", "Threat Modeling"]
    },
    {
        role: "Design Member",
        org: "Eleet Club",
        logo: "eleet.png",
        lor: null,
        bullets: [
            "Created engaging visual content including posters, social media graphics, and event branding for club activities.",
            "Collaborated with the core team to maintain a consistent visual identity across all club communications.",
            "Contributed creative ideas and design assets for workshops, hackathons, and technical events."
        ],
        skills: ["Graphic Design", "Canva", "Visual Identity", "Teamwork"]
    },
    {
        role: "Choreographer",
        org: "Dance with Mehul",
        logo: "dm.png",
        lor: null,
        bullets: [
            "Choreographed and performed dance routines, demonstrating creativity, stage presence, and disciplined practice.",
            "Assisted in coordinating group performances, managing rehearsal schedules and team dynamics.",
            "Developed strong body language, confidence, and performance skills that translate directly to public speaking and presentations."
        ],
        skills: ["Choreography", "Performance", "Team Dynamics", "Creativity"]
    }
];

function initDossierDashboard() {
    const dashboard = document.querySelector('.dossier-dashboard');
    if (!dashboard) return;

    const tabs = dashboard.querySelectorAll('.dossier-tab');
    const screen = dashboard.querySelector('#dossier-screen');
    const contentContainer = dashboard.querySelector('#screen-content');
    const statusText = dashboard.querySelector('#screen-status');

    let activeIndex = 0;
    let decryptTimeout = null;

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (index === activeIndex) return;

            // Update active tab UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeIndex = index;

            // Start decryption transition
            if (screen) screen.classList.add('decrypting');
            if (statusText) statusText.textContent = '[SYSTEM STATUS: DECRYPTING...]';
            if (contentContainer) contentContainer.classList.add('fade-out');

            if (decryptTimeout) clearTimeout(decryptTimeout);

            decryptTimeout = setTimeout(() => {
                const data = EXPS_DATA[activeIndex];
                if (!data) return;

                // Inject new content
                if (contentContainer) {
                    contentContainer.innerHTML = `
                      <div class="screen-header">
                        <div class="header-main-info">
                          <div class="screen-status" id="screen-status">[SYSTEM STATUS: SECURE // DATA DECRYPTED]</div>
                          <h3 class="screen-role">${data.role}</h3>
                          <div class="screen-org-meta">
                            <span class="meta-label">ORG:</span> <span class="meta-val">${data.org}</span>
                          </div>
                        </div>
                        <div class="screen-logo-tab">
                          <div class="tab-corner top-left"></div>
                          <div class="tab-corner top-right"></div>
                          <div class="tab-corner bottom-left"></div>
                          <div class="tab-corner bottom-right"></div>
                          <div class="logo-scanner-container">
                            <div class="scanner-ring"></div>
                            <div class="scanner-ring-outer"></div>
                            <div class="logo-wrapper">
                              <img src="${data.logo}" alt="${data.org} Logo" class="screen-logo" onerror="this.style.display='none';">
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="screen-body">
                        <ul class="screen-bullets">
                          ${data.bullets.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                      </div>

                      <div class="screen-footer">
                        <div class="footer-label">TAGS // SKILLS:</div>
                        <div class="screen-skills-wrap">
                          <div class="screen-skills">
                            ${data.skills.map(s => `<span class="screen-skill-tag">${s}</span>`).join('')}
                          </div>
                          ${data.lor ? `
                            <button class="lor-btn" data-lor="${data.lor}">
                              <span class="lor-btn-glitch"></span>
                              <iconify-icon icon="lucide:file-text" class="lor-icon"></iconify-icon>
                              [ACCESS_LOR]
                            </button>
                          ` : ''}
                        </div>
                      </div>
                    `;

                    contentContainer.classList.remove('fade-out');
                    contentContainer.classList.add('fade-in');
                }

                // Complete decryption visual effect
                setTimeout(() => {
                    if (screen) screen.classList.remove('decrypting');
                    const newStatus = contentContainer ? contentContainer.querySelector('#screen-status') : null;
                    if (newStatus) newStatus.textContent = '[SYSTEM STATUS: SECURE // DATA DECRYPTED]';
                }, 800);

            }, 400); // Wait for fade-out before injecting and fading in
        });
    });

    // Holographic LOR modal controls
    const modal = document.getElementById('lor-modal');
    const modalImg = document.getElementById('lor-img');
    const loadingWrap = document.getElementById('lor-loading');
    const percentSpan = document.getElementById('lor-percent');
    const closeBtn = document.getElementById('lor-modal-close');
    const overlay = document.getElementById('lor-modal-overlay');

    let percentInterval = null;

    function openLor(lorFile) {
        if (!modal || !modalImg) return;
        
        modalImg.src = lorFile;
        modalImg.classList.remove('visible');
        if (loadingWrap) loadingWrap.style.display = 'flex';
        if (percentSpan) percentSpan.textContent = '0';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        let pct = 0;
        if (percentInterval) clearInterval(percentInterval);
        percentInterval = setInterval(() => {
            pct += Math.floor(Math.random() * 15) + 5;
            if (pct >= 100) {
                pct = 100;
                clearInterval(percentInterval);
                setTimeout(() => {
                    if (loadingWrap) loadingWrap.style.display = 'none';
                    modalImg.classList.add('visible');
                }, 300);
            }
            if (percentSpan) percentSpan.textContent = pct;
        }, 50);
    }

    function closeLor() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (percentInterval) clearInterval(percentInterval);
    }

    // Delegate click events for dynamic buttons inside the dashboard
    dashboard.addEventListener('click', (e) => {
        const btn = e.target.closest('.lor-btn');
        if (btn) {
            const file = btn.getAttribute('data-lor');
            if (file) openLor(file);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLor);
    if (overlay) overlay.addEventListener('click', closeLor);
}

// ============================================================
// 20. LIFE OUTSIDE TERMINAL: SHUFFLE GRID & CYBER MUSIC PLAYER
// ============================================================
const SHUFFLE_IMAGES = [
    "final-ipad.png",
    "laedooba.png",
    "MEHUL CHOREO OWNER.png",
    "visual proj 1 .png",
    "visual proj 2 .png",
    "visual proj 3.png",
    "visual proj 4.png",
    "SKILLO OWNER MRUDULA.png",
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1521537634581-175653b6f04f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1592656094270-b852951cc4c5?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80"
];

function initShuffleGrid() {
    const grid = document.getElementById('vanilla-shuffle-grid');
    if (!grid) return;

    // Create 16 initial squares
    for (let i = 0; i < 16; i++) {
        const sq = document.createElement('div');
        sq.className = 'shuffle-square';
        sq.style.backgroundImage = `url('${SHUFFLE_IMAGES[i]}')`;
        grid.appendChild(sq);
    }

    // Helper to shuffle array in-place
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Perform periodic grid reshuffle with staggered spring animations
    setInterval(() => {
        const squares = grid.querySelectorAll('.shuffle-square');
        const shuffled = shuffleArray([...SHUFFLE_IMAGES]);

        squares.forEach((sq, i) => {
            setTimeout(() => {
                sq.style.opacity = '0';
                sq.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    sq.style.backgroundImage = `url('${shuffled[i]}')`;
                    sq.style.opacity = '1';
                    sq.style.transform = 'scale(1)';
                }, 400);
            }, Math.random() * 600);
        });
    }, 4500);
}

function initVinylMusicPlayer() {
    const tracks = [
        {
            title: 'Lae Dooba',
            artist: 'Sunidhi Chauhan — Aiyaary',
            cover: 'laedooba.png',
            src: 'lae-dooba.mp3'
        },
        {
            title: 'Barbaad',
            artist: 'Saiyaara',
            cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
            src: 'lae-dooba.mp3'
        }
    ];

    const artworkWrap = document.getElementById('music-artwork-wrap');
    const albumCover = document.getElementById('album-cover');
    const albumImg = document.getElementById('album-img');
    const vinylCenterImg = document.getElementById('vinyl-center-img');
    const audio = document.getElementById('music-audio');
    const vinylDisc = document.getElementById('vinyl-disc');
    const songNameEl = document.getElementById('music-song-name');
    const artistEl = document.getElementById('music-artist');
    const progressBar = document.getElementById('music-progress-bar');
    const progressFill = document.getElementById('music-progress-fill');
    const currentTimeEl = document.getElementById('music-current-time');
    const totalTimeEl = document.getElementById('music-total-time');

    const playBtn = document.getElementById('music-play-btn');
    const playIcon = document.getElementById('music-play-icon');
    const prevBtn = document.getElementById('music-prev-btn');
    const nextBtn = document.getElementById('music-next-btn');
    const shuffleBtn = document.getElementById('music-shuffle-btn');
    const loopBtn = document.getElementById('music-loop-btn');
    const loopBadge = document.getElementById('music-loop-badge');
    const overlayIcon = document.getElementById('album-play-overlay-icon');

    if (!audio || !albumCover) return;

    // Player State
    let currentIndex = 0;
    let order = [0, 1];
    let shuffled = false;
    let loopMode = 'off'; // 'off' | 'all' | 'one'
    let isPlaying = false;

    // Audio Context & Analyser
    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;
    let dataArray = new Uint8Array(128);
    let connected = false;

    function initAudioContext() {
        if (connected) return;
        try {
            const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextCtor) return;
            audioCtx = new AudioContextCtor();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            sourceNode = audioCtx.createMediaElementSource(audio);
            sourceNode.connect(analyser);
            analyser.connect(audioCtx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            connected = true;
        } catch (e) {
            console.warn("Web Audio API not supported or already setup", e);
        }
    }

    // Play bass transition sound synthesized via Web Audio oscillator
    function playTransitionSound(bassEnergy = 0.5) {
        if (!audioCtx) initAudioContext();
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const startFreq = 440 + bassEnergy * 440;
            const endFreq = startFreq * (2 / 3);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {
            // Unavailable
        }
    }

    // Generate Scales Visualizer SVG Elements dynamically
    const visualizerContainer = document.getElementById('scales-visualizer-container');
    const COLS = 10;
    const ROWS = 10;
    const BAND_RANGES = [
        [0, 1], [1, 3], [3, 6], [6, 10], [10, 16],
        [16, 24], [24, 36], [36, 52], [52, 74], [74, 100],
    ];

    let scalesSvg = null;
    let colGroups = [];
    let circleElements = Array.from({ length: COLS }, () => []);

    function buildVisualizerSVG() {
        if (!visualizerContainer) return;
        const maskId = `visualizer_mask_${Math.floor(Math.random() * 100000)}`;
        
        let colsHtml = '';
        for (let c = 0; c < COLS; c++) {
            let circlesHtml = '';
            for (let r = 0; r < ROWS; r++) {
                circlesHtml += `
                    <g mask="url(#${maskId})" transform="translate(0, ${r * 10})">
                        <circle class="viz-circle" data-col="${c}" data-row="${r}" cx="5" cy="5" r="5" style="transform-box: fill-box; transform-origin: center;"></circle>
                    </g>
                `;
            }
            colsHtml += `
                <g class="viz-col" data-col="${c}" transform="translate(${c * 10}, 0)">
                    ${circlesHtml}
                </g>
            `;
        }

        visualizerContainer.innerHTML = `
            <svg class="scales" viewBox="0 0 98 108" aria-hidden="true">
                <defs>
                    <mask id="${maskId}">
                        <rect width="10" height="10" fill="#fff" />
                    </mask>
                </defs>
                ${colsHtml}
            </svg>
        `;

        scalesSvg = visualizerContainer.querySelector('.scales');
        colGroups = Array.from(visualizerContainer.querySelectorAll('.viz-col'));
        circleElements = Array.from({ length: COLS }, (_, c) => {
            return Array.from(visualizerContainer.querySelectorAll(`.viz-circle[data-col="${c}"]`));
        });
    }
    buildVisualizerSVG();

    // Scales Animation Math
    const PART_A_DUR = 1.5;
    const PART_A_TO = 11;
    const PART_A_STEP = 3 / (COLS - 1);
    const PART_B_DUR = 1;
    const SCALE_FROM = 0.133;
    const SCALE_TO = 0.8;

    const sineOut = (x) => Math.sin((x * Math.PI) / 2);
    const sineIn = (x) => 1 - Math.cos((x * Math.PI) / 2);
    const sineInOut = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
    const lerp = (a, b, t) => a + (b - a) * t;

    function partAColumnY(time, col) {
        const local = time - col * PART_A_STEP;
        const period = PART_A_DUR * 2;
        const cyc = ((local % period) + period) % period;
        if (cyc < PART_A_DUR) return PART_A_TO * sineInOut(cyc / PART_A_DUR);
        return PART_A_TO * sineInOut(1 - (cyc - PART_A_DUR) / PART_A_DUR);
    }

    function partBCircle(time, col, row) {
        const frac = row / ROWS;
        const yFrom = lerp(77, -77, frac);
        const yTo = lerp(col, -col, frac);
        const local = time - col / COLS;
        const period = PART_B_DUR * 2;
        const cyc = ((local % period) + period) % period;
        let e;
        if (cyc < PART_B_DUR) e = sineOut(cyc / PART_B_DUR);
        else e = sineIn(1 - (cyc - PART_B_DUR) / PART_B_DUR);
        return [lerp(yFrom, yTo, e), lerp(SCALE_FROM, SCALE_TO, e)];
    }

    let tRef = 50;
    let lastFrameTime = performance.now();

    function updateVisualizerLoop() {
        const now = performance.now();
        const dt = now - lastFrameTime;
        lastFrameTime = now;

        if (isPlaying) {
            tRef += dt / 1000;
        }

        let freqData = null;
        if (connected && analyser && isPlaying) {
            analyser.getByteFrequencyData(dataArray);
            freqData = dataArray;
        }

        for (let c = 0; c < COLS; c++) {
            let energy = 0.0;
            if (freqData) {
                const [binStart, binEnd] = BAND_RANGES[c];
                let sum = 0;
                for (let b = binStart; b < binEnd; b++) {
                    sum += freqData[b] ?? 0;
                }
                energy = Math.sqrt(sum / (binEnd - binStart) / 255);
            }

            const bobGain = freqData ? 0.4 + energy : 1.0;
            const scaleGain = freqData ? 0.5 + energy : 1.0;

            const colEl = colGroups[c];
            if (colEl) {
                const ay = partAColumnY(tRef, c) * bobGain;
                colEl.style.transform = `translate(${c * 10}px, ${ay}px)`;
            }

            for (let r = 0; r < ROWS; r++) {
                const circle = circleElements[c][r];
                if (circle) {
                    const [ty, s] = partBCircle(tRef, c, r);
                    circle.style.transform = `translateY(${ty}px) scale(${s * scaleGain})`;
                }
            }
        }

        requestAnimationFrame(updateVisualizerLoop);
    }
    requestAnimationFrame(updateVisualizerLoop);

    // Track Loading
    function loadTrack(index, playAfterLoad = false) {
        currentIndex = index;
        const track = tracks[currentIndex];
        
        // Compute current bass energy from visualizer for transition syntesizer
        let bassEnergy = 0.5;
        if (connected && analyser) {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < 4; i++) sum += dataArray[i] || 0;
            bassEnergy = sum / 4 / 255;
        }
        playTransitionSound(bassEnergy);

        // Update elements
        audio.src = track.src;
        albumImg.src = track.cover;
        vinylCenterImg.setAttribute('href', track.cover);
        songNameEl.textContent = track.title;
        artistEl.textContent = track.artist;

        // Reset progress fill
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';

        if (playAfterLoad) {
            audio.play().then(() => {
                setPlayingState(true);
            }).catch(e => {
                console.log("Play failed after load", e);
                setPlayingState(false);
            });
        } else {
            setPlayingState(false);
        }
    }

    function setPlayingState(play) {
        isPlaying = play;
        if (play) {
            artworkWrap.classList.add('is-playing');
            vinylDisc.classList.add('spinning');
            
            playIcon.setAttribute('icon', 'lucide:pause');
            overlayIcon.setAttribute('icon', 'lucide:pause');
        } else {
            artworkWrap.classList.remove('is-playing');
            vinylDisc.classList.remove('spinning');
            
            playIcon.setAttribute('icon', 'lucide:play');
            overlayIcon.setAttribute('icon', 'lucide:play');
        }
    }

    // Toggle Play/Pause
    function toggle() {
        if (!connected) initAudioContext();
        if (audio.paused) {
            audio.play().then(() => {
                setPlayingState(true);
            }).catch(e => console.log("Playback prevented", e));
        } else {
            audio.pause();
            setPlayingState(false);
        }
    }

    // Next Track
    function next() {
        const currentPos = order.indexOf(currentIndex);
        const nextPos = currentPos + 1;
        if (nextPos >= order.length) {
            if (loopMode === 'all') {
                loadTrack(order[0], !audio.paused);
            } else {
                audio.pause();
                audio.currentTime = 0;
                setPlayingState(false);
            }
        } else {
            loadTrack(order[nextPos], !audio.paused);
        }
    }

    // Previous Track
    function prev() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        const currentPos = order.indexOf(currentIndex);
        const prevPos = currentPos - 1;
        if (prevPos < 0) {
            if (loopMode === 'all') {
                loadTrack(order[order.length - 1], !audio.paused);
            } else {
                audio.currentTime = 0;
            }
        } else {
            loadTrack(order[prevPos], !audio.paused);
        }
    }

    // Shuffle
    function toggleShuffle() {
        shuffled = !shuffled;
        if (shuffled) {
            shuffleBtn.classList.add('is-active');
            // Shuffle order pinning current track to index 0
            const rest = [0, 1].filter(x => x !== currentIndex);
            rest.sort(() => Math.random() - 0.5);
            order = [currentIndex, ...rest];
        } else {
            shuffleBtn.classList.remove('is-active');
            order = [0, 1];
        }
    }

    // Loop mode
    function cycleLoop() {
        if (loopMode === 'off') {
            loopMode = 'all';
            loopBtn.classList.add('is-active');
            loopBadge.style.display = 'none';
        } else if (loopMode === 'all') {
            loopMode = 'one';
            loopBtn.classList.add('is-active');
            loopBadge.style.display = 'flex';
        } else {
            loopMode = 'off';
            loopBtn.classList.remove('is-active');
            loopBadge.style.display = 'none';
        }
    }

    // Format seconds to M:SS
    function formatTime(s) {
        if (isNaN(s) || !isFinite(s)) return '0:00';
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    }

    // Click Event Listeners
    albumCover.addEventListener('click', toggle);
    playBtn.addEventListener('click', toggle);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', cycleLoop);

    // Progress Bar click-to-seek
    progressBar.addEventListener('click', e => {
        const rect = progressBar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (audio.duration) {
            audio.currentTime = pct * audio.duration;
        }
    });

    // Time & Progress Updates
    audio.addEventListener('timeupdate', () => {
        const dur = audio.duration || 0;
        const cur = audio.currentTime || 0;
        const pct = dur ? (cur / dur) * 100 : 0;
        progressFill.style.width = `${pct}%`;
        currentTimeEl.textContent = formatTime(cur);
    });

    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (loopMode === 'one') {
            audio.currentTime = 0;
            audio.play().catch(e => console.log(e));
        } else {
            next();
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.key) {
            case ' ':
                e.preventDefault();
                toggle();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (e.shiftKey) next();
                else audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (e.shiftKey) prev();
                else audio.currentTime = Math.max(0, audio.currentTime - 5);
                break;
            case 's':
            case 'S':
                toggleShuffle();
                break;
            case 'l':
            case 'L':
                cycleLoop();
                break;
        }
    });

    // Set initial total time
    if (audio.readyState >= 1) {
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

// Initialize components
document.addEventListener("DOMContentLoaded", () => {
    initDottedSurface();
    initRadialGallery();
    initSpotlights();
    initOrbitingSkills();
    initFAQLightRays();
    initTextRotator();
    initCyberDecryptor();
    initDossierDashboard();
    initShuffleGrid();
    initVinylMusicPlayer();
});
