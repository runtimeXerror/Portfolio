/*
  This file contains all the JavaScript functionality for the portfolio website.
  It handles:
  1. Initialization of the AOS (Animate On Scroll) library.
  2. Toggling the mobile navigation menu.
  3. The typing animation in the hero section.
  4. The particle animation in the hero section background.
*/

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

    // 1. Initialize AOS (Animate On Scroll)
    // This adds fade/slide animations to elements as they enter the viewport.
    AOS.init({
        duration: 800, // Animation duration in milliseconds
        once: true,    // Whether animation should happen only once
    });

    // 2. Initialize Lucide Icons
    // This function finds all elements with the `data-lucide` attribute and replaces them with SVG icons.
    lucide.createIcons();

    // 3. Mobile Menu Toggle Functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Toggle the open class for animation
            mobileMenuButton.classList.toggle('open');
            // For Tailwind group-[.open] support
            mobileMenuButton.classList.toggle('group-[.open]');
        });
    }

    // Close mobile menu when a navigation link is clicked
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a, header nav a');
    if (mobileMenu) {
        for (let link of mobileMenuLinks) {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        }
    }


    // 4. Typing Animation Script
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const roles = ["Full-Stack Web Developer", "UI/UX Designer", "Problem Solver"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];
            let typeSpeed = 150;

            if (isDeleting) {
                // Set speed for deleting
                typeSpeed = 50;
                // Remove a character
                typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Set speed for typing
                typeSpeed = 150;
                // Add a character
                typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            // Check if word is fully typed or deleted
            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end of word, then start deleting
                isDeleting = true;
                typeSpeed = 2000; // Pause duration
            } else if (isDeleting && charIndex === 0) {
                // Move to the next word, then start typing
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing new word
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start the animation
        setTimeout(type, 500);
    }

    // 5. Particle Animation Script
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        // Function to set canvas size
        function resizeCanvas() {
            const homeSection = document.getElementById('home');
            if(homeSection) {
                canvas.width = homeSection.offsetWidth;
                canvas.height = homeSection.offsetHeight;
            }
        }

        // Function to create particles
        function createParticles() {
            particles = [];
            // Adjust particle count based on screen width for better performance
            const particleCount = Math.floor(canvas.width / 25); 
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                });
            }
        }

        // Function to animate particles
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();

                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            // Loop the animation
            requestAnimationFrame(animateParticles);
        }

        // Initial setup
        resizeCanvas();
        createParticles();
        animateParticles();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    // 6. Header Scroll Class Toggle
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    });
});


// Mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
