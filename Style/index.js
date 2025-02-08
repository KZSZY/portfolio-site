// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
});

// Select all sections
const sections = document.querySelectorAll('section');
let currentSection = 0;

// IntersectionObserver  to track active section
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                currentSection = Array.from(sections).indexOf(entry.target);
                updateNavLinks(currentSection);
            }
        });
    },
    {
        threshold: 0.5,
    }
);

// Observe all sections
sections.forEach((section) => observer.observe(section));

// Wheel event for full-screen scroling
window.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++
    } else if (event.deltaY < 0 && currentSection > 0) {
        currentSection--;
    }

    sections[currentSection].scrollIntoView({ behavior: 'smooth'});
});

// Keyboard support for scrolling
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (currentSection < sections.length - 1) {
                currentSection++;
                sections[currentSection].scrollIntoView({ behavior: 'smooth' });
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (currentSection > 0) {
                currentSection--;
                sections[currentSection].scrollIntoView({ behavior: 'smooth'});
            }
            break;
    }
});