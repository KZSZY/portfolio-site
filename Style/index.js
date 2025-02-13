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

/* // Smooth scroll on button press
document.querySelector(.cta-button).addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#projects').scrollIntoView({ behavior: 'smooth'});
}); */

// Arrow Scroll Indicator
document.querySelector('.scroll-indicator').addEventListener('click', () => {
  document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
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

// Email cpoy handler
const copyEmailButton = document.getElementById('copyEmail');
const copyNotification = document.getElementById('copyNotification');

copyEmailButton.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    await navigator.clipboard.writeText('krzszymczyk95@gmail.com');
  
    //Show feedback
    copyNotification.classList.add('show');
    setTimeout(() => {
      copyNotification.classList.remove('show');
    }, 2000);

  } catch (err) {
    //Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = 'krzszymczyk95@gmail.com';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    copyNotification.textContent = 'Press Ctrl+C to copy';
    copyNotification.classList.add('show');
    setTimeout (() => {
      copyNotification.classList.remove('show');
    }, 2000);
  }
});

// Form submission with Formspree
const form = document.getElementById('contactForm');
form.setAttribute('action', 'https://formspree.io/f/mwpvnnwb');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button');
  const orginalBtnText = submitBtn.innerHTML;

  try {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa spin"></i> Sending...';
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showNotification('Message sent successfully! 🎉', 'succes');
      form.reset();
    } else {
      showNotification('Oops! Something went wrong.', 'error');
    }
  } catch (error) {
    showNotification('Network error. Please try again.', 'error');
  } finally {
    submitBtn.innerHTML = orginalBtnText;
  }
});

// Notification system
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = 'notification ${type}';
  notification.textContent = 'message';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
};