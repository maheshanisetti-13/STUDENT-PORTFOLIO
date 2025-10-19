// Theme toggle logic
const themeToggleBtn = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(dark) {
  if(dark) {
    document.body.classList.add('dark');
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
  localStorage.setItem('darkMode', dark ? 'true' : 'false');
}

// Load saved theme or system preference
const savedTheme = localStorage.getItem('darkMode');
if(savedTheme === 'true') {
  setTheme(true);
} else if(savedTheme === 'false') {
  setTheme(false);
} else {
  setTheme(prefersDarkScheme.matches);
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  setTheme(!isDark);
});

// Smooth fade-in on scroll for sections with class "fade-in"
const fadeInElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeInElements.forEach(el => fadeInObserver.observe(el));

// Back to top button logic
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if(window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form validation and submission
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearErrors();
  formStatus.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  let valid = true;

  if (!name) {
    showError('name', 'Name is required');
    valid = false;
  }
  if (!email) {
    showError('email', 'Email is required');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Invalid email format');
    valid = false;
  }
  if (!message) {
    showError('message', 'Message is required');
    valid = false;
  }

  if (!valid) return;

  formStatus.style.color = 'var(--primary)';
  formStatus.textContent = 'Sending...';

  try {
    // Replace URL below with your backend API endpoint
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      formStatus.style.color = 'green';
      formStatus.textContent = 'Message sent successfully!';
      form.reset();
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    formStatus.style.color = 'red';
    formStatus.textContent = 'Error sending message. Please try again later.';
  }
});

function showError(fieldName, message) {
  const input = form[fieldName];
  const error = input.nextElementSibling;
  error.textContent = message;
  error.style.visibility = 'visible';
}

function clearErrors() {
  const errors = form.querySelectorAll('.error-message');
  errors.forEach(err => {
    err.textContent = '';
    err.style.visibility = 'hidden';
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}