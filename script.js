/* =========================================================
   Pablo Rycardo — Portfólio
   JavaScript: tema claro/escuro, menu responsivo,
   efeito de terminal e validação do formulário de contato.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     1) TEMA CLARO / ESCURO
     Salva a preferência do usuário em localStorage para
     que o site lembre a escolha em futuras visitas.
     ----------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'modo escuro' : 'modo claro';
    const icon = isDark ? '🌙' : '☀️';

    const themeLabel = themeToggle.querySelector('.theme-label');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (themeLabel) themeLabel.textContent = label;
    if (themeIcon) themeIcon.textContent = icon;
    if (themeToggleMobile) themeToggleMobile.textContent = icon;
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Recupera a preferência salva (ou usa o padrão definido no HTML)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(root.getAttribute('data-theme') || 'dark');
  }

  themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);


  /* -----------------------------------------------------
     2) MENU RESPONSIVO (sidebar em dispositivos móveis)
     ----------------------------------------------------- */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menu-toggle');

  function openMenu() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em um link (útil no mobile)
  document.querySelectorAll('.file-item').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });


  /* -----------------------------------------------------
     3) DESTACAR ITEM ATIVO NO MENU CONFORME A ROLAGEM
     ----------------------------------------------------- */
  const sections = document.querySelectorAll('.panel');
  const fileItems = document.querySelectorAll('.file-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        fileItems.forEach((item) => {
          item.classList.toggle('is-active', item.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => observer.observe(section));


  /* -----------------------------------------------------
     4) EFEITO DE TERMINAL (digitação automática)
     ----------------------------------------------------- */
  const terminalBody = document.getElementById('terminal-body');

  const terminalLines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'Pablo Rycardo (Ryc)' },
    { type: 'prompt', text: 'cat localizacao.txt' },
    { type: 'out',    text: 'São Luís, Maranhão, Brasil' },
    { type: 'prompt', text: 'cat objetivo.txt' },
    { type: 'out',    text: 'Tornar-se desenvolvedor back-end Java' }
  ];

  function typeTerminal() {
    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
      if (lineIndex >= terminalLines.length) {
        // adiciona o cursor piscando ao final
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        terminalBody.appendChild(cursor);
        return;
      }

      const current = terminalLines[lineIndex];

      if (charIndex === 0) {
        const lineEl = document.createElement('div');
        lineEl.className = 'term-line';

        if (current.type === 'prompt') {
          const promptSpan = document.createElement('span');
          promptSpan.className = 'prompt';
          promptSpan.textContent = '$ ';
          lineEl.appendChild(promptSpan);
        } else {
          const outSpan = document.createElement('span');
          outSpan.className = 'out';
          outSpan.textContent = '> ';
          lineEl.appendChild(outSpan);
        }

        const textSpan = document.createElement('span');
        textSpan.className = current.type === 'prompt' ? '' : 'out';
        lineEl.appendChild(textSpan);
        terminalBody.appendChild(lineEl);
      }

      const lineEl = terminalBody.lastChild;
      const textSpan = lineEl.lastChild;
      textSpan.textContent += current.text.charAt(charIndex);
      charIndex++;

      if (charIndex < current.text.length) {
        setTimeout(typeNextChar, 18);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 220);
      }
    }

    typeNextChar();
  }

  if (terminalBody) {
    typeTerminal();
  }


  /* -----------------------------------------------------
     5) VALIDAÇÃO DO FORMULÁRIO DE CONTATO (simulação)
     ----------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById('erro-' + fieldId);
    const wrapper = field.closest('.field');

    if (message) {
      wrapper.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    let valid = true;

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (nome === '') {
      setError('nome', 'Por favor, informe seu nome.');
      valid = false;
    } else {
      setError('nome', '');
    }

    if (email === '') {
      setError('email', 'Por favor, informe seu e-mail.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setError('email', 'Informe um e-mail válido (ex: usuario@dominio.com).');
      valid = false;
    } else {
      setError('email', '');
    }

    if (mensagem === '') {
      setError('mensagem', 'Por favor, escreva uma mensagem.');
      valid = false;
    } else {
      setError('mensagem', '');
    }

    return valid;
  }

  function openModal() {
    modalOverlay.classList.add('is-open');
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (validateForm()) {
        // Simula o envio: limpa o formulário e mostra confirmação
        form.reset();
        openModal();
      }
    });

    // Remove a mensagem de erro enquanto o usuário corrige o campo
    ['nome', 'email', 'mensagem'].forEach((id) => {
      document.getElementById(id).addEventListener('input', () => setError(id, ''));
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) closeModal();
    });
  }


  /* -----------------------------------------------------
     6) ANO ATUAL NO RODAPÉ
     ----------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
