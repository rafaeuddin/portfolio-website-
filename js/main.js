import { Background } from './background.js';
import { Animations } from './animations.js';

class App {
    constructor() {
        this.background = new Background();
        this.animations = new Animations();
        
        window.addEventListener('resize', () => {
            this.background.onWindowResize();
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Add delay to stagger animations
            const animatedElements = document.querySelectorAll('.animate-in');
            animatedElements.forEach((element, index) => {
                element.style.setProperty('--delay', index);
            });

            // Animate elements when they enter viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });

            animatedElements.forEach(element => {
                observer.observe(element);
            });
        });
    }
}

new App(); 