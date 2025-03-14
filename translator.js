document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language-select');
  
  if (languageSelect) {

    if (typeof translations === 'undefined') {
      console.error('Translations not loaded. Check if translations.js is properly included before translator.js');
      return;
    }
    
    const savedLanguage = localStorage.getItem('language') || 'it';
    languageSelect.value = savedLanguage;
    
    translatePage(savedLanguage);
    
    languageSelect.addEventListener('change', function() {
      const selectedLanguage = this.value;
      localStorage.setItem('language', selectedLanguage);
      translatePage(selectedLanguage);
    });
  }
  
  function translatePage(language) {
    if (!translations[language]) {
      console.warn(`Translation for language "${language}" not found.`);
      return;
    }
    
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[language][key]) {
        element.textContent = translations[language][key];
      } else {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
      }
    });
    
    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (translations[language][key]) {
        element.setAttribute('placeholder', translations[language][key]);
      } else {
        console.warn(`Translation placeholder key "${key}" not found for language "${language}"`);
      }
    });
    
    document.documentElement.lang = language;
    
    const footerCopyright = document.querySelector('footer p');
    if (footerCopyright && translations[language]['copyright']) {
      footerCopyright.textContent = translations[language]['copyright'];
    }
    
    // Aggiorna anche il messaggio di conferma del form di contatto
    updateContactFormMessage(language);
  }
  
  function updateContactFormMessage(language) {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      // Rimuovi eventuali listener precedenti per evitare duplicati
      const newContactForm = contactForm.cloneNode(true);
      contactForm.parentNode.replaceChild(newContactForm, contactForm);
      
      newContactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let thankYouMessage = 'Grazie per il tuo messaggio! Ti risponderò al più presto.';
        
        if (language === 'en') {
          thankYouMessage = 'Thank you for your message! I will get back to you soon.';
        } else if (language === 'es') {
          thankYouMessage = '¡Gracias por tu mensaje! Te responderé pronto.';
        } else if (language === 'fr') {
          thankYouMessage = 'Merci pour votre message! Je vous répondrai bientôt.';
        } else if (language === 'de') {
          thankYouMessage = 'Vielen Dank für Ihre Nachricht! Ich werde mich bald bei Ihnen melden.';
        }
        
        alert(thankYouMessage);
        this.reset();
      });
    }
  }
  
  // Esegui la traduzione anche quando la pagina è completamente caricata
  window.addEventListener('load', function() {
    const currentLang = localStorage.getItem('language') || 'it';
    translatePage(currentLang);
  });
});