document.addEventListener('DOMContentLoaded', () => {

  // FAB social media toggle
  const fab = document.querySelector('.fab-social');
  const fabToggle = document.querySelector('.fab-toggle');
  if (fabToggle && fab) {
    fabToggle.addEventListener('click', () => {
      fab.classList.toggle('active');
    });
    // Inchide cand dai click in afara
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) {
        fab.classList.remove('active');
      }
    });
  }

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navUl = document.querySelector('.main-nav ul');
  if (hamburger && navUl) {
    // Cream overlay
    const overlay = document.createElement('div');
    overlay.classList.add('mobile-overlay');
    document.body.appendChild(overlay);

    const closeMobileMenu = () => {
      hamburger.classList.remove('active');
      navUl.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navUl.classList.toggle('open');
      overlay.classList.toggle('active');
      document.body.style.overflow = navUl.classList.contains('open') ? 'hidden' : '';
    });

    // Click in afara meniului (dar nu pe hamburger) => inchide meniul
    document.addEventListener('click', (e) => {
      if (!navUl.classList.contains('open')) {
        return;
      }

      const clickedInsideMenu = navUl.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideMenu && !clickedHamburger) {
        closeMobileMenu();
      }
    });

    // Click pe link din meniu mobil => inchide + navigheaza explicit
    navUl.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !navUl.classList.contains('open')) {
        return;
      }

      e.preventDefault();
      const targetHref = link.getAttribute('href');
      closeMobileMenu();

      if (targetHref) {
        window.location.href = targetHref;
      }
    });
  }

  // Marcheaza link-ul paginii curente ca activ (compatibil cu URL-uri fara .html)
  const normalizePath = (href) => {
    if (!href || href.startsWith('#') || href.startsWith('http')) {
      return null;
    }

    const [rawPath] = href.split('#');
    let path = rawPath || '/';

    if (path === 'index.html' || path === '/' || path === '/index' || path === '/index.html') {
      return '/acasa';
    }

    if (path.endsWith('.html')) {
      path = `/${path.replace('.html', '')}`;
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    return path.replace(/\/+$/, '') || '/';
  };

  const currentPath = normalizePath(window.location.pathname) || '/acasa';
  document.querySelectorAll('.main-nav ul li a').forEach(link => {
    const linkPath = normalizePath(link.getAttribute('href'));
    if (linkPath && linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Duplicam continutul de 2 ori (total 3 copii) pentru bucla infinita fara goluri
  document.querySelectorAll('.scroll-gallery-row').forEach(row => {
    const content = row.innerHTML;
    row.innerHTML = content + content + content;
  });

  // animatie galerie scroll - selectam DUPA duplicare
  const galleries = document.querySelectorAll('.scroll-gallery-row');
  const scrollSpeed = 1.5;
  const smoothFactor = 0.012; // cat de repede "recupereaza" - mai mic = delay mai mare

  // Pre-calculam latimea unui set de imagini (1/3 din total)
  const galleryWidths = [];
  const currentPositions = []; // pozitia curenta (smoothed)
  galleries.forEach(gallery => {
    galleryWidths.push(gallery.scrollWidth / 3);
    currentPositions.push(0);
  });

  function updateGalleryPosition() {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      galleries.forEach((gallery, i) => {
          const oneSetWidth = galleryWidths[i];
          if (oneSetWidth <= 0) return;

          // Pozitia tinta (unde ar trebui sa fie instant)
          const targetTranslate = scrollTop * scrollSpeed;

          // Lerp: pozitia curenta se apropie treptat de tinta (efect de delay/inertie)
          currentPositions[i] += (targetTranslate - currentPositions[i]) * smoothFactor;

          const isReverse = gallery.classList.contains('reverse');
          let offset = currentPositions[i] % oneSetWidth;

          let newX;
          if (isReverse) {
              newX = offset - oneSetWidth;
          } else {
              newX = -offset - oneSetWidth;
          }

          gallery.style.transform = `translateX(${newX}px)`;
      });

      requestAnimationFrame(updateGalleryPosition);
  }

  // Pornim loop-ul de animatie - functioneaza pe orice dispozitiv
  if (galleries.length > 0) {
      requestAnimationFrame(updateGalleryPosition);
  }

  const nav = document.querySelector('.main-nav');
  let lastScrollY = 0; // initializare cu 0

  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY; // salveaza scroll-ul curent
      
      if (currentScrollY > 100) {
        // 100px dupa ce trecem de videoclip
        nav.classList.add('scrolled');
        
        if (currentScrollY > lastScrollY) {
          // ascunde bara cand dau scroll in jos
          nav.classList.add('hidden');
        } else {
          // reapare bara cand dau scroll in sus
          nav.classList.remove('hidden');
        }
      } else {
        // primii 100px in zona videoclipului
        nav.classList.remove('scrolled');
        nav.classList.remove('hidden');
      }
      
      lastScrollY = currentScrollY; // actualizeaza ultima pozitie
    });
  }

  const form = document.getElementById('contactForm');
  const messageDiv = document.getElementById('message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      console.log("Trimit date:", data);

      try {
        const response = await fetch('/api/users/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Răspuns server:", result);

        if (response.ok) {
          messageDiv.style.display = 'block';
          messageDiv.style.color = 'white';
          messageDiv.style.padding = '15px';
          messageDiv.style.backgroundColor = '#4caf50';
          messageDiv.style.border = '1px solid #45a049';
          messageDiv.style.borderRadius = '4px';
          messageDiv.style.marginTop = '20px';
          messageDiv.textContent = '✓ Cererea ta a fost trimisă cu succes! Te vom contacta în curând.';
          form.reset();
          
          setTimeout(() => {
            messageDiv.style.display = 'none';
          }, 5000);
        } else {
          messageDiv.style.display = 'block';
          messageDiv.style.color = 'white';
          messageDiv.style.padding = '15px';
          messageDiv.style.backgroundColor = '#f44336';
          messageDiv.style.border = '1px solid #d32f2f';
          messageDiv.style.borderRadius = '4px';
          messageDiv.style.marginTop = '20px';
          messageDiv.textContent = '✗ A apărut o eroare. Te rugăm să încerci din nou.';
        }
      } catch (error) {
        console.error('Error:', error);
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '15px';
        messageDiv.style.backgroundColor = '#ff9800';
        messageDiv.style.border = '1px solid #f57c00';
        messageDiv.style.borderRadius = '4px';
        messageDiv.style.marginTop = '20px';
        messageDiv.textContent = '⚠ Eroare de conexiune. Verifică conexiunea la internet.';
      }
    });
  }

  // Lazy loading pentru hero video - incepe autoplay doar cand video e in viewport
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Inițial, video nu e în autoplay
    heroVideo.autoplay = false;
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video e in viewport - porneste autoplay
          heroVideo.autoplay = true;
          heroVideo.play();
        } else {
          // Video nu mai e in viewport - opreste
          heroVideo.autoplay = false;
          heroVideo.pause();
        }
      });
    }, { threshold: 0.25 });
    
    videoObserver.observe(heroVideo);
  }
});
