// Cambiá este número por tu WhatsApp.
// Formato recomendado para Argentina: 549 + código de área + número, sin espacios.
// Ejemplo ficticio: 5491123456789
const WHATSAPP_NUMBER = "5491176756285";

// Animación al hacer scroll
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// FAQ desplegable
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector("span");

    if (!answer) return;

    answer.classList.toggle("open");

    if (icon) {
      icon.textContent = answer.classList.contains("open") ? "−" : "+";
    }
  });
});

// Formulario a WhatsApp
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim() || "";
    const equipo = document.getElementById("equipo")?.value || "";
    const modelo = document.getElementById("modelo")?.value.trim() || "No especificado";
    const servicio = document.getElementById("servicio")?.value || "";
    const zona = document.getElementById("zona")?.value || "";
    const detalle = document.getElementById("detalle")?.value.trim() || "No especificado";
    const codigoPromo = document.getElementById("codigoPromo")?.value.trim().toUpperCase() || "";

    const descuentos = {
      "2693": "10%",
      "2688": "15%",
      "LCDTM": "100%"
    };

    let promoTexto = "Sin código promocional";

    if (codigoPromo) {
      if (descuentos[codigoPromo]) {
        promoTexto = descuentos[codigoPromo].includes("%") ? `Código ${codigoPromo} - Descuento ${descuentos[codigoPromo]}` : `Código ${codigoPromo} - ${descuentos[codigoPromo]}`;
      } else {
        promoTexto = `Código ${codigoPromo} - No válido`;
      }
    }

    const mensaje = `
*Nueva consulta - SoftReset*

*Datos del cliente*
Nombre: ${nombre}
Equipo: ${equipo}
Modelo: ${modelo}

*Servicio*
${servicio}

*Zona*
${zona}

*Detalle del problema*
${detalle}

*Código promocional*
${promoTexto}
`.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, "_blank");
  });
}




// Validación visual del código promocional
const codigoPromoInput = document.getElementById("codigoPromo");
const promoHelp = document.getElementById("promoHelp");

if (codigoPromoInput && promoHelp) {
  codigoPromoInput.addEventListener("input", () => {
    const codigo = codigoPromoInput.value.trim();

    promoHelp.classList.remove("valid", "invalid");

    if (!codigo) {
      promoHelp.textContent = "Ingresá tu código si tenés uno";
      return;
    }

    const codigoNormalizado = codigo.toUpperCase();

    if (codigoNormalizado === "2693") {
      promoHelp.textContent = "Código válido: 10% de descuento";
      promoHelp.classList.add("valid");
    } else if (codigoNormalizado === "2688") {
      promoHelp.textContent = "Código válido: 15% de descuento";
      promoHelp.classList.add("valid");
    } else if (codigoNormalizado === "LCDTM") {
      promoHelp.textContent = "Código válido: 100% de descuento. Ahora entrega la Cola";
      promoHelp.classList.add("valid");
    } else {
      promoHelp.textContent = "Código no válido";
      promoHelp.classList.add("invalid");
    }
  });
}









// Interacción de las tarjetas de servicios.
// PC: se activa solo mientras el mouse está encima.
// Android/iPhone: se activa solo mientras la tarjeta cruza la zona central de la pantalla.
const arcServiceCards = document.querySelectorAll(".arc-service-card");

if (arcServiceCards.length) {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const colorPeekDelay = 820;
  const colorPeekTimers = new WeakMap();

  const clearServiceCardColor = (card) => {
    const startTimer = colorPeekTimers.get(card);

    if (startTimer) window.clearTimeout(startTimer);

    colorPeekTimers.delete(card);
    card.classList.remove("is-color-peek");
  };

  const isServiceCardStillActive = (card) => {
    return card.classList.contains("is-active") || card.matches(":hover") || card.matches(":focus-within");
  };

  const scheduleServiceCardColor = (card) => {
    clearServiceCardColor(card);

    const startTimer = window.setTimeout(() => {
      if (!isServiceCardStillActive(card)) return;

      // Después de aparecer el color, queda activo hasta que el cuadro deje de estar activo/visible.
      card.classList.add("is-color-peek");
      colorPeekTimers.delete(card);
    }, colorPeekDelay);

    colorPeekTimers.set(card, startTimer);
  };

  const clearServiceCards = () => {
    arcServiceCards.forEach((card) => {
      card.classList.remove("is-active");
      clearServiceCardColor(card);
    });
  };

  const clearCardFocus = () => {
    const active = document.activeElement;
    if (active && active.closest?.(".arc-service-card")) {
      active.blur();
    }
  };

  arcServiceCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Quita el foco táctil, pero no apaga el efecto mientras el cuadro siga activo/visible.
      window.setTimeout(clearCardFocus, 120);
    });
  });

  const activateServiceCard = (activeCard) => {
    arcServiceCards.forEach((card) => {
      const shouldBeActive = card === activeCard;
      const wasActive = card.classList.contains("is-active");

      card.classList.toggle("is-active", shouldBeActive);

      if (shouldBeActive && !wasActive) {
        scheduleServiceCardColor(card);
      }

      if (!shouldBeActive) {
        clearServiceCardColor(card);
      }
    });
  };

  if (canHover) {
    arcServiceCards.forEach((card) => {
      card.addEventListener("pointerenter", () => activateServiceCard(card));
      card.addEventListener("pointerleave", clearServiceCards);
      card.addEventListener("blur", clearServiceCards);
    });
  } else if ("IntersectionObserver" in window) {
    const visibleCardRatios = new Map();

    const serviceCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleCardRatios.set(entry.target, entry.intersectionRatio);
          } else {
            visibleCardRatios.delete(entry.target);
            entry.target.classList.remove("is-active");
            clearServiceCardColor(entry.target);
          }
        });

        const mostVisibleCard = [...visibleCardRatios.entries()]
          .sort((a, b) => b[1] - a[1])[0];

        if (mostVisibleCard) {
          activateServiceCard(mostVisibleCard[0]);
        } else {
          clearServiceCards();
        }
      },
      {
        // Zona central: evita que una tarjeta quede activa solo por haber sido tocada o enfocada.
        rootMargin: "-32% 0px -32% 0px",
        threshold: [0, 0.08, 0.18, 0.32, 0.5, 0.7]
      }
    );

    arcServiceCards.forEach((card) => serviceCardObserver.observe(card));

    window.addEventListener("scroll", () => {
      // Al scrollear, eliminamos el foco que Android puede dejar pegado después de tocar una tarjeta.
      if (document.activeElement && document.activeElement.closest?.(".arc-service-card")) {
        document.activeElement.blur();
      }
    }, { passive: true });
  } else {
    arcServiceCards.forEach((card) => {
      card.addEventListener("touchstart", () => {
        activateServiceCard(card);
        window.setTimeout(clearServiceCards, 900);
      }, { passive: true });
    });
  }
}

// Interacción de las cuatro opciones de Formateo + Instalación de Windows.
const formatFeatureButtons = document.querySelectorAll(".format-feature-button");
const formatDisplayTitle = document.getElementById("formatDisplayTitle");
const formatHeroTitle = document.getElementById("formatHeroTitle");
const formatDisplayLabel = document.getElementById("formatDisplayLabel");
const formatDisplayText = document.getElementById("formatDisplayText");
const formatDetailsText = document.getElementById("formatDetailsText");
const formatDisplayList = document.getElementById("formatDisplayList");
const formatDisplayImage = document.getElementById("formatDisplayImage");

if (formatFeatureButtons.length && formatDisplayTitle && formatDisplayText && formatDisplayList) {
  formatFeatureButtons.forEach((button) => {
    button.addEventListener("click", () => {
      formatFeatureButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      if (formatHeroTitle) formatHeroTitle.textContent = button.dataset.heroTitle || button.dataset.title || "";
      formatDisplayTitle.textContent = button.dataset.title || "";
      if (formatDisplayLabel) formatDisplayLabel.textContent = button.dataset.label || button.dataset.title || "";
      formatDisplayText.textContent = button.dataset.heroText || button.dataset.text || "";
      if (formatDetailsText) formatDetailsText.textContent = button.dataset.text || "";

      if (formatDisplayImage && button.dataset.image) {
        formatDisplayImage.src = button.dataset.image;
        formatDisplayImage.alt = button.dataset.alt || button.dataset.title || "";
        formatDisplayImage.style.setProperty("--format-mobile-position", button.dataset.mobilePosition || "center center");
        formatDisplayImage.style.setProperty("--format-mobile-scale", button.dataset.mobileScale || "1.08");
      }
      const items = (button.dataset.items || "").split("|").map((item) => item.trim()).filter(Boolean);
      formatDisplayList.innerHTML = items.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }).reduce((html, li) => html + li.outerHTML, "");

      // En Limpieza y Mantenimiento, llevar suavemente al servicio seleccionado.
      // Se limita a esta página para no alterar la interacción de Formateo.
      if (document.body.classList.contains("limpieza-page")) {
        const display = document.querySelector(".format-display");
        if (display) {
          requestAnimationFrame(() => {
            const top = display.getBoundingClientRect().top + window.scrollY - 14;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          });
        }
      }
    });
  });
}

// Tema claro / oscuro integrado en la barra flotante.
(() => {
  const STORAGE_KEY = "softreset-theme";
  const root = document.documentElement;
  const toggles = document.querySelectorAll(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  if (!toggles.length) return;

  const getTheme = () => root.dataset.theme === "dark" ? "dark" : "light";

  const updateControls = (theme) => {
    const dark = theme === "dark";
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
      toggle.setAttribute("title", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    });

    if (themeMeta) {
      themeMeta.setAttribute("content", dark ? "#1b1d1f" : "#f5f7fb");
    }
  };

  const applyTheme = (theme, persist = true) => {
    const normalized = theme === "dark" ? "dark" : "light";
    root.dataset.theme = normalized;
    updateControls(normalized);

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
      } catch (_) {
        // El sitio sigue funcionando aunque el navegador bloquee localStorage.
      }
    }
  };

  updateControls(getTheme());

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
  });

  // Sincroniza pestañas abiertas del mismo sitio.
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue, false);
    }
  });
})();


// Barra flotante: prueba visual rápida al cargar y auto-ocultación con reaparición fiable.
(() => {
  const bars = Array.from(document.querySelectorAll('.mobile-bottom-bar'));
  if (!bars.length) return;

  const HIDE_AFTER_MS = 6000;
  const TEST_VISIBLE_MS = 650;
  const TEST_HIDDEN_MS = 650;
  let hideTimer = null;
  let reappearTimer = null;
  let testTimers = [];
  let testing = false;

  const setHidden = (hidden) => {
    bars.forEach((bar) => bar.classList.toggle('auto-hidden', hidden));
  };

  const clearTestTimers = () => {
    testTimers.forEach((timer) => window.clearTimeout(timer));
    testTimers = [];
    testing = false;
  };

  const scheduleAutoHide = () => {
    if (hideTimer !== null) window.clearTimeout(hideTimer);
    if (reappearTimer !== null) window.clearTimeout(reappearTimer);
    hideTimer = window.setTimeout(() => {
      setHidden(true);
      hideTimer = null;
      // Si no hay interacción, vuelve a mostrarse sola tras una pausa breve.
      reappearTimer = window.setTimeout(() => {
        setHidden(false);
        reappearTimer = null;
        scheduleAutoHide();
      }, 1500);
    }, HIDE_AFTER_MS);
  };

  // Cualquier interacción, incluida la pulsación de la propia barra,
  // cancela la prueba si aún está activa, muestra la barra y reinicia el plazo.
  const showAndRestart = () => {
    if (testing) clearTestTimers();
    if (reappearTimer !== null) window.clearTimeout(reappearTimer);
    reappearTimer = null;
    setHidden(false);
    scheduleAutoHide();
  };

  const runQuickTest = () => {
    clearTestTimers();
    testing = true;
    setHidden(false);
    for (let i = 0; i < 3; i++) {
      const hideAt = TEST_VISIBLE_MS + i * (TEST_VISIBLE_MS + TEST_HIDDEN_MS);
      testTimers.push(window.setTimeout(() => setHidden(true), hideAt));
      testTimers.push(window.setTimeout(() => setHidden(false), hideAt + TEST_HIDDEN_MS));
    }
    const finishAt = 3 * (TEST_VISIBLE_MS + TEST_HIDDEN_MS);
    testTimers.push(window.setTimeout(() => {
      testing = false;
      testTimers = [];
      scheduleAutoHide();
    }, finishAt));
  };

  // Usar document y window mejora la detección en navegadores táctiles y de escritorio.
  ['pointerdown', 'click', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach((eventName) => {
    document.addEventListener(eventName, showAndRestart, { passive: true, capture: true });
  });
  window.addEventListener('focus', showAndRestart);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) showAndRestart();
  });

  runQuickTest();
})();
