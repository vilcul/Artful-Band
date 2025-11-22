document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.scroll-gallery-row').forEach(row => {
    const content = row.innerHTML;
    row.innerHTML += content;
  });

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
});

// animatie galerie scroll
const galleries = document.querySelectorAll('.scroll-gallery-row');
const scrollSpeed = 0.5; // Viteza redusa pentru miscare mai lenta si mai fluida
let ticking = false; // Throttling pentru performanta

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;

            galleries.forEach(gallery => {
                // calculam latimea totala a imaginilor originale
                const scrollWidth = gallery.scrollWidth / 2;
                
                // calculam valoarea translatiei
                let baseTranslate = scrollTop * scrollSpeed;

                // determinam directia
                const direction = gallery.classList.contains('reverse') ? 1 : -1;

                // aplicam directia si folosim modulo pentru bucla infinita
                let newX = (baseTranslate * direction) % scrollWidth;

                // Pentru randul 'reverse', mentinem offset-ul initial
                if (gallery.classList.contains('reverse')) {
                    newX -= scrollWidth;
                }

                gallery.style.transform = `translateX(${newX}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});