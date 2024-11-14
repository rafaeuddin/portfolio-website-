import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

export class Animations {
    constructor() {
        this.setupIntersectionObserver();
        this.setupScrollAnimation();
        this.setupProjectCards();
        this.setupParticleText();
        this.setupSkillsProgress();
        this.setupLoadingScreen();
        this.setupEasterEggs();
        this.setupTimelineAnimation();
    }

    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.animate-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        animatedElements.forEach((element, index) => {
            element.style.setProperty('--delay', index);
            observer.observe(element);
        });
    }

    animateElement(element) {
        // Add 3D transform effect
        element.style.transform = 'translateZ(0)';
        element.style.opacity = '1';
        
        // Add subtle hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateZ(50px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateZ(0) scale(1)';
        });
    }

    setupScrollAnimation() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Parallax effect for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = 0.1;
                    const yOffset = (window.innerHeight - rect.top) * speed;
                    section.style.transform = `translateY(${yOffset}px)`;
                }
            });
            
            lastScrollTop = scrollTop;
        });
    }

    setupProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            // Add tech stack tags
            const techStack = card.getAttribute('data-tech')?.split(',') || [];
            if (techStack.length) {
                const techStackDiv = card.querySelector('.tech-stack');
                
                techStack.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech.trim();
                    techStackDiv.appendChild(tag);
                });
            }

            // Enhanced hover effects
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Update custom properties for glow effect
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // 3D rotation effect
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                    translateY(-10px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
            });

            // Add click handler for mobile devices
            card.addEventListener('click', () => {
                const hoverContent = card.querySelector('.project-hover-content');
                hoverContent.style.opacity = hoverContent.style.opacity === '1' ? '0' : '1';
                hoverContent.style.transform = 
                    hoverContent.style.transform === 'translateY(0px)' ? 
                    'translateY(100%)' : 'translateY(0)';
            });
        });
    }

    setupParticleText() {
        const titles = document.querySelectorAll('h1, h2');
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            
            [...text].forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'particle-text';
                title.appendChild(span);
            });
        });
    }

    setupSkillsProgress() {
        const skills = document.querySelectorAll('.skill-category');
        
        skills.forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                const progressBar = document.createElement('div');
                progressBar.className = 'skill-progress';
                progressBar.style.width = '0%';
                skill.appendChild(progressBar);
                
                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 100);
            });
            
            skill.addEventListener('mouseleave', () => {
                const progressBar = skill.querySelector('.skill-progress');
                if (progressBar) {
                    progressBar.remove();
                }
            });
        });
    }

    setupLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'loading-screen';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Experience...</div>
            </div>
        `;
        document.body.appendChild(loader);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }

    setupEasterEggs() {
        let konamiCode = '';
        const secretCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
        
        document.addEventListener('keydown', (e) => {
            konamiCode += e.key;
            if (konamiCode.includes(secretCode)) {
                this.triggerEasterEgg();
                konamiCode = '';
            }
        });
    }

    triggerEasterEgg() {
        document.body.style.animation = 'matrix 2s forwards';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }

    setupSkillsAnimation() {
        // Animate progress bars
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.width = `${level}%`;
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });

        // Animate skill circles
        const circles = document.querySelectorAll('.skill-circle');
        circles.forEach(circle => {
            const level = circle.getAttribute('data-level');
            const circlePath = circle.querySelector('.circle');
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        circlePath.style.strokeDasharray = `${level}, 100`;
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(circle);
        });
    }

    setupTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Animate marker
                    const marker = entry.target.querySelector('.timeline-marker');
                    marker.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        marker.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            observer.observe(item);
        });
    }
} 