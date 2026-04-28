// LateralBridge - Main JavaScript File

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      if (mobileMenu.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
      } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    });
  }
  
  // Set active nav link based on current page
  setActiveNav();
  
  // Add scroll reveal animations
  addScrollAnimations();
});

// Set Active Navigation Link
function setActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (currentPath === linkPath || 
        (currentPath === '/' && linkPath.includes('index.html')) ||
        (currentPath.includes(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
      
      // Add background element for desktop nav
      if (link.classList.contains('nav-link') && !link.querySelector('.nav-link-bg')) {
        const bg = document.createElement('span');
        bg.className = 'nav-link-bg';
        link.insertBefore(bg, link.firstChild);
      }
    }
  });
}

// Scroll Reveal Animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .hero-content, section > .container').forEach(el => {
    observer.observe(el);
  });
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Form Submission Handler
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Show success message
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Sent Successfully!';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    form.reset();
  }, 3000);
}

// Quiz Functionality
class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestion = 0;
    this.answers = [];
    this.questions = [
      {
        question: "What is the derivative of x² with respect to x?",
        options: ["2x", "x²", "2x²", "x"],
        correct: 0
      },
      {
        question: "Which data structure uses LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1
      }
    ];
  }
  
  startQuiz(quizIndex) {
    this.currentQuiz = quizIndex;
    this.currentQuestion = 0;
    this.answers = [];
    this.showQuestion();
  }
  
  showQuestion() {
    const question = this.questions[this.currentQuestion];
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizContainer) return;
    
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
    
    quizContainer.innerHTML = `
      <div class="quiz-progress mb-4">
        <div class="flex justify-between mb-2">
          <span>Question ${this.currentQuestion + 1} of ${this.questions.length}</span>
          <span>${Math.round(progress)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
      
      <div class="card p-6 mb-4">
        <h3 class="text-2xl mb-6">${question.question}</h3>
        <div class="quiz-options">
          ${question.options.map((option, index) => `
            <button class="quiz-option" data-index="${index}">
              <span class="option-check"></span>
              <span>${option}</span>
            </button>
          `).join('')}
        </div>
        
        <div class="flex gap-4 mt-6">
          <button onclick="quiz.exitQuiz()" class="btn-secondary flex-none">Exit Quiz</button>
          <button id="nextBtn" onclick="quiz.nextQuestion()" disabled class="btn-primary flex-1">
            ${this.currentQuestion < this.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    `;
    
    // Add option selection handlers
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectOption(e.currentTarget));
    });
  }
  
  selectOption(button) {
    document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    
    const selectedIndex = parseInt(button.dataset.index);
    this.answers[this.currentQuestion] = selectedIndex;
    
    document.getElementById('nextBtn').disabled = false;
  }
  
  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.showQuestion();
    } else {
      this.showResults();
    }
  }
  
  showResults() {
    let correct = 0;
    this.answers.forEach((answer, index) => {
      if (answer === this.questions[index].correct) correct++;
    });
    
    const percentage = (correct / this.questions.length) * 100;
    const quizContainer = document.getElementById('quizContainer');
    
    quizContainer.innerHTML = `
      <div class="card p-6 text-center">
        <div class="quiz-trophy mb-6">🏆</div>
        <h2 class="text-3xl mb-4">Quiz Completed!</h2>
        <p class="text-xl mb-6">You scored ${correct} out of ${this.questions.length}</p>
        <div class="text-5xl font-bold text-gradient mb-4">${Math.round(percentage)}%</div>
        <p class="mb-6">
          ${percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
        </p>
        <button onclick="quiz.exitQuiz()" class="btn-primary">Back to Assessments</button>
      </div>
    `;
  }
  
  exitQuiz() {
    window.location.reload();
  }
}

// Initialize quiz manager
const quiz = new QuizManager();

// Course Module Expansion
function toggleCourseModules(courseIndex) {
  const modulesDiv = document.getElementById(`modules-${courseIndex}`);
  const btn = document.getElementById(`toggle-btn-${courseIndex}`);
  
  if (modulesDiv && btn) {
    if (modulesDiv.style.display === 'none' || !modulesDiv.style.display) {
      modulesDiv.style.display = 'block';
      btn.textContent = 'Hide Modules';
    } else {
      modulesDiv.style.display = 'none';
      btn.textContent = 'View Modules';
    }
  }
}

// Utility function to create icon SVGs
function createIcon(iconName, className = 'icon') {
  const icons = {
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    'graduation-cap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',
    'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
  };
  
  return `<svg class="${className}" viewBox="0 0 24 24">${icons[iconName] || ''}</svg>`;
}
