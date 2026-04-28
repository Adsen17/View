// --- 1. BOOT SEQUENCE ---
        const bootText = [
            "Initializing Synergy OS...",
            "Loading Neural Archive...",
            "Bypassing Standard UI Protocols...",
            "Access Granted."
        ];
        let bootIndex = 0;
        
        function runBoot() {
            if(bootIndex < bootText.length) {
                document.querySelector('.typing-line').innerHTML += `<div>> ${bootText[bootIndex]}</div>`;
                bootIndex++;
                setTimeout(runBoot, Math.random() * 300 + 200);
            } else {
                setTimeout(() => {
                    gsap.to('#boot-screen', {opacity: 0, duration: 1, onComplete: () => {
                        document.getElementById('boot-screen').style.display = 'none';
                        initApp();
                    }});
                }, 500);
            }
        }
        window.onload = () => setTimeout(runBoot, 300);

        // --- 2. THREE.JS ENGINE ---
        let scene, camera, renderer, particlesMesh;
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let baseCamera = { x: 0, z: 15 };
        
        function initThree() {
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x050507, 0.002);
            camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 15;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 600 : 2000;
            const geometry = new THREE.BufferGeometry();
            const posArray = new Float32Array(particleCount * 3);
            for(let i=0; i<particleCount*3; i++) posArray[i] = (Math.random() - 0.5) * 50;
            
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const material = new THREE.PointsMaterial({ size: 0.05, color: 0x00FFC6, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
            particlesMesh = new THREE.Points(geometry, material);
            scene.add(particlesMesh);

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                buildNavNodes();
                let hash = window.location.hash.replace('#', '') || 'hub';
                document.querySelectorAll('.nav-node').forEach(n => {
                    if(n.getAttribute('href') === `#${hash}`) n.classList.add('active-nav');
                });
            });

            animateThree();
        }

        function animateThree() {
            requestAnimationFrame(animateThree);
            particlesMesh.rotation.y -= 0.0005;
            
            const targetX = baseCamera.x + (mouseX / window.innerWidth - 0.5) * 2;
            const targetY = -(mouseY / window.innerHeight - 0.5) * 2;
            
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.position.z = baseCamera.z;
            
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }

        // --- 3. ROUTING LOGIC ---
        const routes = ['hub', 'about', 'works', 'legacy', 'contact'];
        
        function handleRouting() {
            let hash = window.location.hash.replace('#', '') || 'hub';
            if(!routes.includes(hash)) hash = 'hub';
            
            triggerGlitch();

            document.querySelectorAll('.page-section').forEach(sec => {
                sec.classList.remove('active');
                gsap.set(sec, {opacity: 0, y: 20});
            });

            const activeSec = document.getElementById(hash);
            activeSec.classList.add('active');
            gsap.to(activeSec, {opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2});

            document.getElementById('system-status').innerText = `SYS.ON // ${hash.toUpperCase()}`;
            document.body.style.overflowY = (hash === 'about' || hash === 'legacy' || hash === 'works') ? 'auto' : 'hidden';
            window.scrollTo(0,0);

            // Menyembunyikan menu orbit jika bukan di halaman awal (hub) agar tidak menabrak teks
            if (hash === 'hub') {
                document.getElementById('nav-system').style.display = 'block';
                gsap.to('#nav-system', {opacity: 1, duration: 0.5});
                gsap.to('#back-to-hub', {opacity: 0, duration: 0.3, onComplete: () => document.getElementById('back-to-hub').style.display = 'none'});
            } else {
                gsap.to('#nav-system', {opacity: 0, duration: 0.5, onComplete: () => document.getElementById('nav-system').style.display = 'none'});
                document.getElementById('back-to-hub').style.display = 'block';
                gsap.to('#back-to-hub', {opacity: 1, duration: 0.5, delay: 0.3});
            }

            document.querySelectorAll('.nav-node').forEach(n => {
                n.classList.remove('active-nav');
                if(n.getAttribute('href') === `#${hash}`) n.classList.add('active-nav');
            });

            if(hash === 'works') gsap.to(baseCamera, {z: 8, x: 0, duration: 1.5});
            else if(hash === 'about') gsap.to(baseCamera, {z: 12, x: 2, duration: 1});
            else gsap.to(baseCamera, {z: 15, x: 0, duration: 1.5});

            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 100);
            }
        }

        function triggerGlitch() {
            const el = document.getElementById('glitch-effect');
            el.classList.remove('glitch-active');
            void el.offsetWidth;
            el.classList.add('glitch-active');
            setTimeout(() => el.classList.remove('glitch-active'), 400);
        }

        window.addEventListener('hashchange', handleRouting);

        // --- 4. ORBIT NAV ---
        function buildNavNodes() {
            const nav = document.getElementById('nav-system');
            nav.classList.remove('hidden');
            const isMobile = window.innerWidth < 768;
            
            // Menggunakan bentuk elips (Radius X lebih lebar dari Radius Y)
            const radiusX = isMobile ? 140 : Math.min(420, window.innerWidth / 2 - 60);
            const radiusY = isMobile ? 160 : Math.min(260, window.innerHeight / 2 - 50);
            
            let html = `<a href="#hub" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/40 hover-target z-50 pointer-events-auto transition-transform hover:scale-150 hover:bg-neonCyan shadow-[0_0_15px_rgba(0,255,198,0.3)]"></a>`;
            
            const outerRoutes = routes.filter(r => r !== 'hub');
            outerRoutes.forEach((route, i) => {
                const angle = (i * (Math.PI * 2) / outerRoutes.length) - (Math.PI / 2); 
                const x = Math.cos(angle) * radiusX;
                const y = Math.sin(angle) * radiusY;
                
                html += `
                    <a href="#${route}" class="nav-node hover-target font-bold text-[0.65rem] md:text-xs uppercase tracking-widest opacity-50 pointer-events-auto" 
                       style="left: calc(50% + ${x}px); top: calc(50% + ${y}px); transform: translate(-50%, -50%);">
                       [ ${route} ]
                    </a>`;
            });
            nav.innerHTML = html;
            bindHoverEffects();
        }

        // --- 5. TERMINAL LOGIC, SOUND & ANIMATION ---
        
        // Audio System (Web Audio API)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let soundEnabled = true;

        const soundToggle = document.getElementById('sound-toggle');
        const soundStatus = document.getElementById('sound-status');
        
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            soundEnabled = !soundEnabled;
            soundStatus.innerText = soundEnabled ? 'ON' : 'OFF';
            soundToggle.classList.toggle('text-hotPink', soundEnabled);
            soundToggle.classList.toggle('text-gray-500', !soundEnabled);
            if(soundEnabled && audioCtx.state === 'suspended') audioCtx.resume();
        });

        function playTone(freq, type, duration, vol) {
            if (!soundEnabled) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        }

        const sounds = {
            type: () => playTone(800, 'sine', 0.05, 0.02),
            submit: () => playTone(150, 'square', 0.2, 0.05),
            success: () => {
                playTone(400, 'sine', 0.1, 0.05);
                setTimeout(() => playTone(600, 'sine', 0.2, 0.05), 100);
                setTimeout(() => playTone(1200, 'sine', 0.4, 0.05), 200);
            },
            error: () => {
                playTone(200, 'sawtooth', 0.3, 0.05);
                setTimeout(() => playTone(150, 'sawtooth', 0.4, 0.05), 150);
            }
        };

        // Terminal Typing Animation
        async function typeTerminalLines(lines, outputEl, statusClass = 'text-gray-400', clear = false) {
            if (clear) outputEl.innerHTML = '';
            for (let i = 0; i < lines.length; i++) {
                const lineDiv = document.createElement('div');
                lineDiv.className = (i === lines.length - 1 && statusClass !== 'text-gray-400') ? statusClass : 'text-gray-400';
                outputEl.appendChild(lineDiv);
                
                let currentText = '> ';
                lineDiv.innerHTML = currentText + '<span class="animate-pulse">_</span>';
                
                const chars = lines[i].split('');
                for (let c = 0; c < chars.length; c++) {
                    currentText += chars[c];
                    lineDiv.innerHTML = currentText + '<span class="animate-pulse">_</span>';
                    if(chars[c] !== ' ' && Math.random() > 0.4) sounds.type();
                    await new Promise(r => setTimeout(r, Math.random() * 20 + 10));
                }
                lineDiv.innerHTML = currentText; 
                outputEl.scrollTop = outputEl.scrollHeight;
                await new Promise(r => setTimeout(r, 300));
            }
        }

        // Contact Form AJAX & GSAP
        const form = document.getElementById('contact-form');
        const output = document.getElementById('terminal-output');
        const btn = document.getElementById('submit-btn');
        const panel = document.getElementById('terminal-panel');
        const topEdge = document.getElementById('terminal-top-edge');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            btn.disabled = true;
            btn.innerHTML = '[ SENDING... ]';
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            
            sounds.submit();
            gsap.timeline()
                .to(panel, {x: -5, skewX: 2, duration: 0.05})
                .to(panel, {x: 5, skewX: -2, duration: 0.05})
                .to(panel, {x: -2, skewX: 1, duration: 0.05})
                .to(panel, {x: 0, skewX: 0, duration: 0.05})
                .to(topEdge, {opacity: 0.2, duration: 0.1, yoyo: true, repeat: 3}, 0);

            const formData = new FormData(form);
            try {
                const progressLines = [
                    "Sending Signal...",
                    "Establishing Secure Channel...",
                    "Encrypting Transmission...",
                    "Syncing With Legacy Network..."
                ];
                
                const typingPromise = typeTerminalLines(progressLines, output, 'text-gray-400', true);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                await typingPromise;

                if (response.ok) {
                    sounds.success();
                    gsap.timeline()
                        .to(panel, {boxShadow: "0 0 100px rgba(0,255,198,0.6)", scale: 1.02, duration: 0.2})
                        .to(panel, {boxShadow: "0 0 50px rgba(0,0,0,0.5)", scale: 1, duration: 0.5});
                    
                    await typeTerminalLines(["Transmission Complete ✓"], output, 'text-neonCyan drop-shadow-[0_0_5px_rgba(0,255,198,0.8)]', false);
                    btn.innerHTML = '[ SIGNAL SENT ✓ ]';
                    form.reset();
                } else {
                    throw new Error('Transmission Error');
                }
            } catch (error) {
                sounds.error();
                gsap.timeline()
                    .to(panel, {boxShadow: "0 0 100px rgba(255,61,110,0.6)", x: 10, duration: 0.1})
                    .to(panel, {x: -10, duration: 0.1})
                    .to(panel, {boxShadow: "0 0 50px rgba(0,0,0,0.5)", x: 0, duration: 0.2});
                
                await typeTerminalLines(["Transmission Failed ✗", "Retry Connection Protocol."], output, 'text-hotPink drop-shadow-[0_0_5px_rgba(255,61,110,0.8)]', false);
                btn.innerHTML = '[ RETRY TRANSMISSION ]';
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });

        // --- 6. MODAL WORKS (FIXED NAV OVERLAP) ---
        const worksData = {
            "1": { t: "Smart Dashboard System", p: "Monitoring data across multiple sources was inefficient and slow.", s: "Built an interactive dashboard system using Laravel and real-time data updates.", i: "Improved efficiency and reduced monitoring time significantly." },
            "2": { t: "Portfolio Experience System", p: "Traditional portfolios fail to engage users.", s: "Developed an immersive portfolio system with interactive UI and animation.", i: "Increased user engagement and improved personal branding." },
            "3": { t: "Task Automation Platform", p: "Manual workflows caused inefficiency and delays.", s: "Created a system to automate repetitive digital tasks.", i: "Reduced workload and improved productivity." },
            "4": { t: "Interactive UI Prototype", p: "Static UI lacks engagement.", s: "Designed experimental UI with motion and interaction.", i: "Enhanced user experience and visual appeal." }
        };
        
        document.querySelectorAll('.work-fragment').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.work;
                document.getElementById('detail-title').innerText = worksData[id].t;
                document.getElementById('detail-prob').innerText = worksData[id].p;
                document.getElementById('detail-sys').innerText = worksData[id].s;
                document.getElementById('detail-imp').innerText = worksData[id].i;
                
                const modal = document.getElementById('work-detail');
                const nav = document.getElementById('nav-system'); // Select Nav System
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // HIDE NAV ORBIT SAAT MODAL DIBUKA (Menghindari tabrakan teks)
                gsap.to(nav, {opacity: 0, duration: 0.3, pointerEvents: 'none'}); 
                gsap.to('#back-to-hub', {opacity: 0, duration: 0.3, pointerEvents: 'none'}); // Sembunyikan tombol return to hub
                gsap.fromTo(modal, {opacity:0, scale:0.9}, {opacity:1, scale:1, duration:0.3});
            });
        });
        
        document.getElementById('close-work').addEventListener('click', () => {
            const modal = document.getElementById('work-detail');
            
            // MUNCULKAN KEMBALI BACK TO HUB
            gsap.to('#back-to-hub', {opacity: 1, duration: 0.3, pointerEvents: 'auto'});
            
            gsap.to(modal, {opacity:0, scale:0.9, duration:0.2, onComplete: () => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }});
        });

        // --- 7. UX TAMBAHAN ---
        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            if(cursor) { cursor.style.left = `${mouseX}px`; cursor.style.top = `${mouseY}px`; }
        });

        function bindHoverEffects() {
            document.querySelectorAll('.hover-target, a').forEach(el => {
                el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
            });
        }

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Hapus efek aktif dari semua tombol
                document.querySelectorAll('.mode-btn').forEach(b => {
                    b.classList.remove('text-neonCyan', 'text-hotPink', 'text-electricViolet', 'drop-shadow-[0_0_8px_rgba(0,255,198,0.8)]', 'drop-shadow-[0_0_8px_rgba(255,61,110,0.8)]', 'drop-shadow-[0_0_8px_rgba(138,92,255,0.8)]');
                });

                const mode = this.dataset.mode;
                document.body.className = `font-thin text-white antialiased mode-${mode}`;
                
                let pColor = 0x00FFC6;
                if (mode === 'future') {
                    pColor = 0xFF3D6E; // Pink
                    this.classList.add('text-hotPink', 'drop-shadow-[0_0_8px_rgba(255,61,110,0.8)]');
                } else if (mode === 'system') {
                    pColor = 0x8A5CFF; // Violet
                    this.classList.add('text-electricViolet', 'drop-shadow-[0_0_8px_rgba(138,92,255,0.8)]');
                } else {
                    pColor = 0x00FFC6; // Cyan
                    this.classList.add('text-neonCyan', 'drop-shadow-[0_0_8px_rgba(0,255,198,0.8)]');
                }
                
                particlesMesh.material.color.setHex(pColor);
                triggerGlitch();
            });
        });

        const lenis = new Lenis({ duration: 1.2, smooth: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        function initApp() {
            initThree();
            buildNavNodes();
            handleRouting();
            
            gsap.registerPlugin(ScrollTrigger);
            document.querySelectorAll('.timeline-node').forEach(node => {
                gsap.from(node, {
                    scrollTrigger: { trigger: node, start: "top 85%" },
                    x: -30, opacity: 0, duration: 0.8
                });
            });
        }