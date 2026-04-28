<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Command Center | Contact</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syncopate:wght@400;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        bgBase: '#050507',
                        bgDeep: '#0F172A',
                        neonCyan: '#00FFC6',
                        electricViolet: '#8A5CFF',
                        hotPink: '#FF3D6E',
                        goldAccent: '#FFD166',
                    },
                    fontFamily: {
                        thin: ['Space Mono', 'monospace'],
                        bold: ['Syncopate', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #050507; color: #ffffff; overflow-x: hidden; margin: 0; }
        .glass-panel {
            background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 255, 198, 0.2); border-left: 2px solid var(--theme-accent, #00FFC6);
            box-shadow: 0 0 20px rgba(0, 255, 198, 0.1);
        }
        .terminal-input {
            background: transparent; border: none; border-bottom: 1px dashed rgba(255,255,255,0.2); outline: none;
            color: #00FFC6; font-family: 'Space Mono', monospace; width: 100%; padding: 5px 0; transition: border-color 0.3s;
        }
        .terminal-input:focus { border-bottom: 1px solid #FF3D6E; box-shadow: 0 4px 10px -6px #FF3D6E; }
        .glitch-submit { transition: all 0.2s; position: relative; }
        .glitch-submit:hover { text-shadow: 2px 0 #FF3D6E, -2px 0 #00FFC6; transform: scale(1.02); }
        .blinking-cursor::after { content: '_'; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        /* Glitch effect on form submit */
        @keyframes glitch-anim {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 2px) }
            40% { transform: translate(-2px, -2px) }
            60% { transform: translate(2px, 2px) }
            80% { transform: translate(2px, -2px) }
            100% { transform: translate(0) }
        }
        .is-submitting { animation: glitch-anim 0.3s infinite; opacity: 0.8; pointer-events: none; }
    </style>
</head>
<body class="font-thin antialiased flex items-center justify-center min-h-screen p-4">

    <!-- Ambient Glow Background -->
    <div class="fixed inset-0 z-[-1] pointer-events-none opacity-20" style="background: radial-gradient(circle at 50% 50%, rgba(138, 92, 255, 0.15) 0%, transparent 50%);"></div>

    <div class="w-full max-w-2xl glass-panel p-8 md:p-12 relative">
        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neonCyan via-electricViolet to-hotPink"></div>
        
        <div class="text-xs tracking-widest text-neonCyan mb-8 uppercase blinking-cursor">Command Center // Terminal</div>
        
        <!-- Status Messages -->
        <div id="terminal-output" class="text-xs md:text-sm space-y-3 mb-8 opacity-90 h-32 overflow-y-auto">
            <div class="text-electricViolet">> Initiate Connection</div>
            <div>> Waiting for input...</div>
            
            @if(session('success'))
                <div class="text-neonCyan mt-4">> Connection Established.</div>
                <div class="text-neonCyan font-bold">> {{ session('success') }}</div>
            @endif

            @if(session('error'))
                <div class="text-hotPink mt-4">> SYSTEM ERROR: {{ session('error') }}</div>
            @endif

            @if ($errors->any())
                <div class="text-hotPink mt-4">
                    > CRITICAL ERROR DETECTED:
                    <ul class="ml-4 mt-2 list-disc opacity-80">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>

        <!-- Contact Form -->
        <form action="{{ route('contact.submit') }}" method="POST" id="contact-form" class="space-y-8 border-t border-white/10 pt-8">
            @csrf
            
            <div class="relative group">
                <label class="text-xs text-electricViolet opacity-70 mb-2 block">> Enter Name:</label>
                <div class="flex items-center gap-3">
                    <span class="text-hotPink font-bold">></span>
                    <input type="text" name="name" value="{{ old('name') }}" class="terminal-input" autocomplete="off" required placeholder="John Doe">
                </div>
            </div>

            <div class="relative group">
                <label class="text-xs text-electricViolet opacity-70 mb-2 block">> Enter Email:</label>
                <div class="flex items-center gap-3">
                    <span class="text-hotPink font-bold">></span>
                    <input type="email" name="email" value="{{ old('email') }}" class="terminal-input" autocomplete="off" required placeholder="signal@domain.com">
                </div>
            </div>

            <div class="relative group">
                <label class="text-xs text-electricViolet opacity-70 mb-2 block">> Enter Message:</label>
                <div class="flex items-start gap-3">
                    <span class="text-hotPink font-bold pt-1">></span>
                    <textarea name="message" rows="4" class="terminal-input resize-none" required placeholder="Type transmission here...">{{ old('message') }}</textarea>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button type="submit" class="glitch-submit px-6 py-2 border border-neonCyan text-neonCyan text-xs uppercase tracking-[0.2em] hover:bg-neonCyan/10 transition-colors">
                    [ SEND_SIGNAL ]
                </button>
            </div>
        </form>
        
        <!-- Real Contact info below form -->
        <div class="mt-12 pt-6 border-t border-white/5 text-[10px] md:text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-4 font-thin uppercase tracking-widest">
            <a href="mailto:Keiferr17@gmail.com" class="hover:text-neonCyan transition-colors">SYS.MAIL: Keiferr17@gmail.com</a>
            <a href="https://github.com/Adsen17" target="_blank" class="hover:text-neonCyan transition-colors">GITHUB.COM/ADSEN17</a>
            <a href="https://linkedin.com/in/keiferr-17" target="_blank" class="hover:text-neonCyan transition-colors">LINKEDIN: KEIFERR-17</a>
        </div>
    </div>

    <script>
        document.getElementById('contact-form').addEventListener('submit', function() {
            const output = document.getElementById('terminal-output');
            const btn = document.querySelector('.glitch-submit');
            
            output.innerHTML += '<div class="text-goldAccent mt-4">> Sending Signal...</div>';
            output.innerHTML += '<div class="text-goldAccent">> Establishing Secure Channel...</div>';
            output.scrollTop = output.scrollHeight;
            
            btn.innerHTML = '[ TRANSMITTING... ]';
            document.querySelector('.glass-panel').classList.add('is-submitting');
        });
    </script>
</body>
</html>
