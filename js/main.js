/* ==========================================================================
   SYNAPTIC TECH - INTERACTIVIDAD Y EFECTOS DE INTERFAZ (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Efecto Scroll en la Cabecera (Header Scroll Glow)
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Simulador Financiero Interactivo del Combo POS Premium
  const slider = document.getElementById('finance-slider');
  const initialPercentText = document.getElementById('initial-percentage-text');
  const initialValueText = document.getElementById('display-initial-investment');
  const financedValueText = document.getElementById('display-financed-balance');
  
  const TOTAL_PRICE = 6850000; // $6.850.000 COP

  // Función para formatear números a formato de moneda COP
  function formatCOP(amount) {
    return '$' + amount.toLocaleString('de-DE') + ' COP';
  }

  function updateCalculator() {
    const percent = parseInt(slider.value);
    
    // Calcular valores
    const initialPayment = TOTAL_PRICE * (percent / 100);
    const financedBalance = TOTAL_PRICE - initialPayment;
    
    // Actualizar textos en la interfaz
    initialPercentText.textContent = `${percent}% Inicial`;
    initialValueText.textContent = formatCOP(initialPayment);
    financedValueText.textContent = formatCOP(financedBalance);
  }

  if (slider) {
    slider.addEventListener('input', updateCalculator);
    // Inicializar calculadora
    updateCalculator();
  }

  // 3. Revelado de Elementos al Hacer Scroll (Fade-In & Slide-Up)
  // Crear una clase dinámica para los elementos que queremos revelar
  const revealElements = [
    document.getElementById('card-virtualization'),
    document.getElementById('card-erp'),
    document.getElementById('card-security'),
    document.getElementById('card-analytics'),
    document.getElementById('pos-premium-offer-card'),
    document.getElementById('pos-description-paragraph'),
    document.getElementById('adv-trayectoria'),
    document.getElementById('adv-monitoreo'),
    document.getElementById('adv-flexibilidad'),
    document.getElementById('leader-professional-card'),
    document.getElementById('main-contact-form'),
    document.getElementById('email-contact-link'),
    document.getElementById('location-contact-info')
  ];

  // Aplicar estilos iniciales de ocultación de forma segura por JS 
  // para evitar fallos si el usuario no tiene JS activado
  revealElements.forEach(el => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Se activa cuando el 15% del elemento está en pantalla
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        // Dejar de observar una vez que ha aparecido
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    if (el) observer.observe(el);
  });

  // 4. Navegación con Scroll Suave Activa (Highlight Active Link)
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      // Determinar qué sección está actualmente en el viewport
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      // Comparar el hash del link con el ID de la sección actual
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
        link.style.color = 'var(--color-accent)';
      } else {
        link.style.color = ''; // Resetear al valor del CSS
      }
    });
  });

  // 5. Interactividad de Pestañas de la Suite ERP PSKloud
  const tabButtons = document.querySelectorAll('.ps-tab-btn');
  const tabPanes = document.querySelectorAll('.ps-tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa de todos los botones en esta sección
      tabButtons.forEach(b => b.classList.remove('active'));
      // Añadir clase activa al botón presionado
      btn.classList.add('active');

      const targetTabId = btn.getAttribute('data-tab');

      // Ocultar todos los paneles
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });

      // Mostrar el panel seleccionado con animación (definida en CSS)
      const activePane = document.getElementById(targetTabId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // 6. Agregar la Suite PSKloud al Intersection Observer de Scroll
  const psSuiteHeader = document.getElementById('pskloud-suite-title');
  const psTabsContainer = document.querySelector('.ps-tabs-container');

  if (psSuiteHeader) {
    psSuiteHeader.style.opacity = '0';
    psSuiteHeader.style.transform = 'translateY(30px)';
    psSuiteHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(psSuiteHeader);
  }
  
  if (psTabsContainer) {
    psTabsContainer.style.opacity = '0';
    psTabsContainer.style.transform = 'translateY(30px)';
    psTabsContainer.style.transition = 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s';
    observer.observe(psTabsContainer);
  }
});
