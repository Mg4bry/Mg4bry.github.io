document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
  
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
      }
    });
  });
  
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
    }
  });
  
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }
  
  const skillLevels = document.querySelectorAll('.skill-level');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const originalWidth = entry.target.getAttribute('data-width') || entry.target.style.width;
        entry.target.style.width = originalWidth;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  skillLevels.forEach(level => {
    const originalWidth = level.style.width;
    level.setAttribute('data-width', originalWidth);
    level.style.width = '0%';
    observer.observe(level);
  });
  
  setTimeout(() => {
    skillLevels.forEach(level => {
      const width = level.getAttribute('style').replace('width: 0%', '').trim();
      level.style.width = width || level.style.width;
    });
  }, 300);
  
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const currentLang = localStorage.getItem('language') || 'it';
      
      let thankYouMessage = 'Grazie per il tuo messaggio! Ti risponderò al più presto.';
      
      if (currentLang === 'en') {
        thankYouMessage = 'Thank you for your message! I will get back to you soon.';
      } else if (currentLang === 'es') {
        thankYouMessage = '¡Gracias por tu mensaje! Te responderé pronto.';
      } else if (currentLang === 'fr') {
        thankYouMessage = 'Merci pour votre message! Je vous répondrai bientôt.';
      } else if (currentLang === 'de') {
        thankYouMessage = 'Vielen Dank für Ihre Nachricht! Ich werde mich bald bei Ihnen melden.';
      }
      
      alert(thankYouMessage);
      contactForm.reset();
    });
  }
});