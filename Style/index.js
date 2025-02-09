//Select all sections and nav links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
let currentSection = 0;

// IntersectionObserver to track active section
const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(sections).indexOf(entry.target);
          currentSection = sectionIndex;
          updateNavLinks(sectionIndex);
        }
      });
    },
    {
      threshold: 0.5,
      //rootMargin: '0px 0px -50% 0px'
    }
);

// Observe all sections
sections.forEach((section) => observer.observe(section));

// Update active nav link
function updateNavLinks(index) {
    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');
}

// Nav link click handler
navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      currentSection = index;
      sections[currentSection].scrollIntoView({ behavior: 'smooth' });
      updateNavLinks(currentSection);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

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

// Keyboard support
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
          sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
});

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    this.reset();
});
