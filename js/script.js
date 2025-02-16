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
      rootMargin: '0px 0px -50% 0px'
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


// Wheel event for full-screen scroling //  
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
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      showNotification('Message sent successfully! 🎉', 'success');
      form.reset();
    } else {
      const errorData = await response.json();
      showNotification(`Error: ${errorData.error || 'Something went wrong.'}`, error);
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
  notification.className = `notification ${type}`;
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

// Aria Attributess
navLinks.forEach((link, index) => {
  link.setAttribute('aria-label', `Scroll to ${sections[index].id}`);
});

// Language switcher
const languageSwitcher = {
  currentLang: 'en',
  
  init() {
      // Load saved language
      const savedLang = localStorage.getItem('siteLang');
      this.currentLang = savedLang || 'en';
      this.loadLanguage();
      
      // Add button click handlers
      document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              this.currentLang = e.target.dataset.lang;
              localStorage.setItem('siteLang', this.currentLang);
              this.loadLanguage();
          });
      });
  },

  async loadLanguage() {
      try {
          const response = await fetch(`./locales/${this.currentLang}.json`);
          const translations = await response.json();
          
          // Update active button
          document.querySelectorAll('.lang-btn').forEach(btn => {
              btn.classList.toggle('active-lang', btn.dataset.lang === this.currentLang);
          });

          // Update content
          document.querySelectorAll('[data-i18n]').forEach(element => {
              const key = element.dataset.i18n;
              element.innerHTML = translations[key];
          });

          // Update placeholders and aria-labels
          document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
              const key = element.dataset.i18nPlaceholder;
              element.placeholder = translations[key];
          });

          // Update navigation links
          const navTranslations = translations.nav;
          document.querySelectorAll('.nav-links a').forEach((link, index) => {
              link.textContent = Object.values(navTranslations)[index];
          });
          
      } catch (error) {
          console.error('Error loading language file:', error);
      }
  }
};

// Initialize language switcher
document.addEventListener('DOMContentLoaded', () => languageSwitcher.init());