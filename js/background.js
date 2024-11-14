import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { translations } from './translations.js';

export class Background {
    constructor() {
        this.initLoadingScreen();
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.nodes = [];
        this.connections = [];
        this.networkGroup = new THREE.Group();
        
        this.init();
        this.createNeuralNetwork();
        this.addMouseEffect();
        this.setupNavigation();
        this.setupContactForm();
        this.animate();
        this.initEasterEggs();
        this.setupThemeToggle();
        this.setupLanguageSwitcher();
        this.setupBackgroundModes();
        this.setupTimelineAnimation();
        this.setupAchievementBadges();
    }

    initLoadingScreen() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.content = document.querySelector('main');
        this.navbar = document.querySelector('.navbar');
        
        // Hide content initially
        this.content.classList.add('content-hidden');
        this.navbar.classList.add('content-hidden');
        
        // Start loading timer
        this.loadingTimer = setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000); // Minimum loading time of 2 seconds
    }

    hideLoadingScreen() {
        // Show content
        this.content.classList.remove('content-hidden');
        this.content.classList.add('content-visible');
        this.navbar.classList.remove('content-hidden');
        this.navbar.classList.add('content-visible');
        
        // Hide loading screen
        this.loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }

    init() {
        window.addEventListener('load', () => {
            if (this.loadingTimer) {
                clearTimeout(this.loadingTimer);
                this.hideLoadingScreen();
            }
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.z = 50;
        this.scene.add(this.networkGroup);
        this.scene.fog = new THREE.FogExp2('#0f172a', 0.001);

        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight('#38bdf8', 0.5);
        const pointLight1 = new THREE.PointLight('#7dd3fc', 2, 100);
        const pointLight2 = new THREE.PointLight('#0ea5e9', 1.5, 100);
        
        pointLight1.position.set(20, 20, 20);
        pointLight2.position.set(-20, -20, -20);
        
        this.scene.add(ambientLight, pointLight1, pointLight2);
    }

    createNeuralNetwork() {
        const layers = [6, 8, 8, 6]; // Neural network architecture
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: '#7dd3fc',
            emissive: '#38bdf8',
            emissiveIntensity: 0.5,
            shininess: 90
        });

        let xSpacing = 15;
        let ySpacing = 4;
        
        // Create nodes
        layers.forEach((nodesInLayer, layerIndex) => {
            const layerX = (layerIndex - (layers.length - 1) / 2) * xSpacing;
            
            for (let i = 0; i < nodesInLayer; i++) {
                const y = (i - (nodesInLayer - 1) / 2) * ySpacing;
                
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                node.position.set(layerX, y, 0);
                node.userData = { 
                    originalPosition: node.position.clone(),
                    pulsePhase: Math.random() * Math.PI * 2
                };
                
                this.nodes.push(node);
                this.networkGroup.add(node);
            }
        });

        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: '#38bdf8',
            transparent: true,
            opacity: 0.3
        });

        // Connect each layer to the next
        let currentIndex = 0;
        for (let l = 0; l < layers.length - 1; l++) {
            for (let i = 0; i < layers[l]; i++) {
                for (let j = 0; j < layers[l + 1]; j++) {
                    const startNode = this.nodes[currentIndex + i];
                    const endNode = this.nodes[currentIndex + layers[l] + j];
                    
                    const points = [];
                    points.push(startNode.position);
                    points.push(endNode.position);
                    
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);
                    line.userData = {
                        startNode,
                        endNode,
                        originalOpacity: 0.3,
                        pulsePhase: Math.random() * Math.PI * 2
                    };
                    
                    this.connections.push(line);
                    this.networkGroup.add(line);
                }
            }
            currentIndex += layers[l];
        }

        // Initial rotation
        this.networkGroup.rotation.x = 0.2;
    }

    addMouseEffect() {
        document.addEventListener('mousemove', (event) => {
            const rect = document.querySelector('#bg-canvas').getBoundingClientRect();
            this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrolled / maxScroll;
            
            this.networkGroup.rotation.y = scrollProgress * Math.PI;
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Active section highlighting
        const sections = document.querySelectorAll('section');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.001;

        // Animate nodes
        this.nodes.forEach(node => {
            // Pulsing effect
            const scale = 1 + Math.sin(time * 2 + node.userData.pulsePhase) * 0.1;
            node.scale.set(scale, scale, scale);
            
            // Gentle floating motion
            const pos = node.userData.originalPosition;
            node.position.x = pos.x + Math.sin(time + node.userData.pulsePhase) * 0.2;
            node.position.y = pos.y + Math.cos(time + node.userData.pulsePhase) * 0.2;
        });

        // Animate connections
        this.connections.forEach(line => {
            // Update line positions
            const positions = line.geometry.attributes.position;
            positions.setXYZ(0, 
                line.userData.startNode.position.x,
                line.userData.startNode.position.y,
                line.userData.startNode.position.z
            );
            positions.setXYZ(1,
                line.userData.endNode.position.x,
                line.userData.endNode.position.y,
                line.userData.endNode.position.z
            );
            positions.needsUpdate = true;

            // Pulsing opacity
            line.material.opacity = line.userData.originalOpacity + 
                Math.sin(time * 3 + line.userData.pulsePhase) * 0.2;
        });

        // Mouse interaction
        if (this.mouseX && this.mouseY) {
            const targetRotationX = this.mouseY * 0.5;
            const targetRotationY = this.mouseX * 0.5;
            
            this.networkGroup.rotation.x += (targetRotationX - this.networkGroup.rotation.x) * 0.05;
            this.networkGroup.rotation.y += (targetRotationY - this.networkGroup.rotation.y) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initEasterEggs() {
        // Konami Code
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        
        // Matrix Rain Code
        this.matrixMode = false;
        
        // Secret Click Pattern
        this.clickPattern = [];
        this.secretPattern = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        this.setupEasterEggListeners();
    }

    setupEasterEggListeners() {
        // Konami Code listener
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.triggerKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });

        // Matrix Mode (Press 'm' key)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'm') {
                this.toggleMatrixMode();
            }
        });

        // Secret Click Pattern
        document.addEventListener('click', (e) => {
            const rect = document.body.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const position = 
                y < rect.height / 2 
                    ? (x < rect.width / 2 ? 'top-left' : 'top-right')
                    : (x < rect.width / 2 ? 'bottom-left' : 'bottom-right');
            
            this.clickPattern.push(position);
            
            if (this.clickPattern.length > this.secretPattern.length) {
                this.clickPattern.shift();
            }
            
            if (this.arraysEqual(this.clickPattern, this.secretPattern)) {
                this.triggerSecretPattern();
                this.clickPattern = [];
            }
        });
    }

    triggerKonamiCode() {
        // Invert all colors on the page
        document.body.style.animation = 'invert 0.5s forwards';
        
        setTimeout(() => {
            document.body.style.animation = 'none';
        }, 3000);
    }

    toggleMatrixMode() {
        this.matrixMode = !this.matrixMode;
        document.body.classList.toggle('matrix-mode');
        
        // Change neural network colors
        const color = this.matrixMode ? '#00ff00' : '#7dd3fc';
        this.nodes.forEach(node => {
            node.material.color.setStyle(color);
            node.material.emissive.setStyle(this.matrixMode ? '#003300' : '#38bdf8');
        });
        
        this.connections.forEach(line => {
            line.material.color.setStyle(color);
        });
    }

    triggerSecretPattern() {
        // Create floating emojis
        const emojis = ['🚀', '✨', '💫', '🌟', '💻', '🤖'];
        for (let i = 0; i < 20; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            document.body.appendChild(emoji);
            
            setTimeout(() => {
                emoji.remove();
            }, 3000);
        }
    }

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = form.querySelector('.form-status');

        const validateField = (field) => {
            const value = field.value.trim();
            const fieldName = field.name;
            const errorSpan = field.parentElement.querySelector('.form-error');
            
            field.classList.remove('error');
            errorSpan.classList.remove('visible');

            if (!value) {
                field.classList.add('error');
                errorSpan.textContent = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                errorSpan.classList.add('visible');
                return false;
            }

            if (fieldName === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                field.classList.add('error');
                errorSpan.textContent = 'Please enter a valid email address';
                errorSpan.classList.add('visible');
                return false;
            }

            return true;
        };

        const showFormStatus = (message, type) => {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 3000);
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fields = form.querySelectorAll('input, textarea');
            let isValid = true;

            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            const submitButton = form.querySelector('button');
            submitButton.classList.add('loading');

            try {
                // Replace this with your actual form submission logic
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
                
                showFormStatus('Message sent successfully!', 'success');
                form.reset();
                
                // Add success animation to button
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                setTimeout(() => {
                    submitButton.classList.remove('success');
                }, 2000);

            } catch (error) {
                showFormStatus('Failed to send message. Please try again.', 'error');
                submitButton.classList.remove('loading');
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    }

    setupThemeToggle() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = savedTheme === 'dark' ? '🌙' : '☀️';
        document.querySelector('.nav-container').appendChild(themeToggle);

        // Handle theme toggle
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
            
            // Update Three.js colors
            this.updateThemeColors(newTheme);
        });

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
                this.updateThemeColors(newTheme);
            }
        });
    }

    updateThemeColors(theme) {
        const isLight = theme === 'light';
        
        // Update scene colors
        this.scene.fog.color.setStyle(isLight ? '#f8fafc' : '#0f172a');
        
        // Update node colors
        this.nodes.forEach(node => {
            node.material.color.setStyle(isLight ? '#0284c7' : '#7dd3fc');
            node.material.emissive.setStyle(isLight ? '#0369a1' : '#38bdf8');
        });
        
        // Update connection colors
        this.connections.forEach(line => {
            line.material.color.setStyle(isLight ? '#0284c7' : '#7dd3fc');
            line.material.opacity = isLight ? 0.2 : 0.3;
        });
        
        // Update lights
        this.scene.children.forEach(child => {
            if (child.isLight) {
                if (child.isAmbientLight) {
                    child.color.setStyle(isLight ? '#0369a1' : '#38bdf8');
                } else if (child.isPointLight) {
                    child.color.setStyle(isLight ? '#0284c7' : '#7dd3fc');
                }
            }
        });
    }

    createSkillsGraph() {
        // Create 3D visualization of skills as interconnected nodes
        // Each skill node size represents proficiency
        // Connections show related skills
        // Interactive hover effects show details
    }

    setupLanguageSwitcher() {
        const languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
        ];

        // Create language switcher
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        
        const currentLang = localStorage.getItem('language') || 'en';
        const currentLangData = languages.find(lang => lang.code === currentLang);

        // Create button
        const button = document.createElement('button');
        button.className = 'language-button';
        button.innerHTML = `
            <span>${currentLangData.flag}</span>
            <span>${currentLangData.code.toUpperCase()}</span>
        `;

        // Create options
        const options = document.createElement('div');
        options.className = 'language-options';
        
        languages.forEach(lang => {
            const option = document.createElement('div');
            option.className = `language-option ${lang.code === currentLang ? 'active' : ''}`;
            option.innerHTML = `
                <span>${lang.flag}</span>
                <span>${lang.name}</span>
            `;
            
            option.addEventListener('click', () => {
                this.changeLanguage(lang.code);
                options.classList.remove('show');
                button.innerHTML = `
                    <span>${lang.flag}</span>
                    <span>${lang.code.toUpperCase()}</span>
                `;
                
                document.querySelectorAll('.language-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
            
            options.appendChild(option);
        });

        // Toggle options
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            options.classList.toggle('show');
        });

        // Close options when clicking outside
        document.addEventListener('click', () => {
            options.classList.remove('show');
        });

        switcher.appendChild(button);
        switcher.appendChild(options);
        document.querySelector('.nav-container').appendChild(switcher);

        // Initial translation
        this.translatePage(currentLang);
    }

    changeLanguage(langCode) {
        localStorage.setItem('language', langCode);
        this.translatePage(langCode);
    }

    translatePage(langCode) {
        const translation = translations[langCode];
        
        // Translate navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            const key = link.getAttribute('href').slice(1);
            if (translation.nav[key]) {
                link.textContent = translation.nav[key];
            }
        });

        // Translate hero section
        document.querySelector('h1').textContent = translation.hero.title;
        document.querySelector('.title').textContent = translation.hero.subtitle;

        // Translate section headings
        document.querySelectorAll('section').forEach(section => {
            const id = section.getAttribute('id');
            const heading = section.querySelector('h2');
            if (heading && translation.sections[id]) {
                heading.textContent = translation.sections[id];
            }
        });

        // Translate form
        const form = document.getElementById('contact-form');
        if (form) {
            form.querySelector('[name="name"]').placeholder = translation.form.name;
            form.querySelector('[name="email"]').placeholder = translation.form.email;
            form.querySelector('[name="message"]').placeholder = translation.form.message;
            form.querySelector('button .button-text').textContent = translation.form.send;
        }

        // Update HTML lang attribute
        document.documentElement.lang = langCode;
    }

    setupBackgroundModes() {
        // Different visual modes:
        // - Neural Network (current)
        // - Particle System
        // - Geometric Patterns
        // - etc.
    }

    setupTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineProgress = document.querySelector('.timeline-progress');
        
        const animateTimeline = () => {
            const scrollPosition = window.scrollY;
            const timelineSection = document.querySelector('#experience');
            const timelineSectionTop = timelineSection.offsetTop;
            const timelineSectionHeight = timelineSection.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress
            const scrollPercentage = Math.min(
                Math.max(
                    (scrollPosition - (timelineSectionTop - windowHeight / 2)) /
                    (timelineSectionHeight + windowHeight / 2),
                    0
                ),
                1
            );

            // Update progress line
            if (timelineProgress) {
                timelineProgress.style.height = `${scrollPercentage * 100}%`;
            }

            // Animate timeline items
            timelineItems.forEach((item, index) => {
                const itemTop = item.offsetTop + timelineSectionTop;
                
                if (scrollPosition > itemTop - windowHeight * 0.8) {
                    item.classList.add('animate');
                }
            });
        };

        // Initial animation
        animateTimeline();

        // Animate on scroll
        window.addEventListener('scroll', animateTimeline);
    }

    setupAchievementBadges() {
        const badges = document.querySelectorAll('.achievement-badge');
        
        const animateBadges = () => {
            badges.forEach(badge => {
                const rect = badge.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                
                if (isVisible) {
                    badge.style.animation = 'badgePulse 2s ease-in-out infinite';
                } else {
                    badge.style.animation = 'none';
                }
            });
        };

        // Initial check
        animateBadges();
        
        // Animate on scroll
        window.addEventListener('scroll', animateBadges);
    }
} 