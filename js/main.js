// Cambiá este número por tu WhatsApp.
// Formato recomendado para Argentina: 549 + código de área + número, sin espacios.
// Ejemplo ficticio: 5491123456789
const WHATSAPP_NUMBER = "5491158768929";

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
*Nueva consulta - SoftCleaning*

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


// Promoción flotante 10% OFF
const promoFloating = document.getElementById("promoFloating");
const promoTrigger = document.getElementById("promoTrigger");
const promoClose = document.getElementById("promoClose");
const promoModal = document.getElementById("promoModal");
const promoModalClose = document.getElementById("promoModalClose");
const promoCopy = document.getElementById("promoCopy");
const promoCopyStatus = document.getElementById("promoCopyStatus");
const promoCode = "2693";

if (promoFloating) {
  const hidePromo = () => {
    promoFloating.classList.add("is-hidden");
  };

  const openPromo = () => {
    if (promoModal) {
      promoModal.classList.add("is-active");
      promoModal.setAttribute("aria-hidden", "false");
    }
  };

  const closePromoModal = () => {
    if (promoModal) {
      promoModal.classList.remove("is-active");
      promoModal.setAttribute("aria-hidden", "true");
    }
  };

  promoTrigger?.addEventListener("click", openPromo);

  promoClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    hidePromo();
  });

  promoModalClose?.addEventListener("click", closePromoModal);

  promoModal?.addEventListener("click", (event) => {
    if (event.target === promoModal) closePromoModal();
  });

  promoCopy?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      if (promoCopyStatus) promoCopyStatus.textContent = "Código copiado.";
    } catch {
      if (promoCopyStatus) promoCopyStatus.textContent = "Código: 2693";
    }
  });
}




// Promo 10% OFF: aparece solo en la sección Planes con ciclo controlado
(() => {
  const promo = document.getElementById("promoFloating");
  const planes = document.getElementById("planes");
  const closeBtn = document.getElementById("promoClose");

  if (!promo || !planes) return;

  let isInPlanes = false;
  let closedManually = false;
  let showTimer = null;
  let hideTimer = null;

  function forceHide() {
    promo.classList.remove("promo-visible");
    promo.style.setProperty("opacity", "0", "important");
    promo.style.setProperty("pointer-events", "none", "important");
    promo.style.setProperty("transform", "translateX(36px) scale(0.92)", "important");
  }

  function forceShow() {
    if (!isInPlanes || closedManually) return;

    promo.classList.add("promo-visible");
    promo.style.setProperty("display", "block", "important");
    promo.style.setProperty("opacity", "1", "important");
    promo.style.setProperty("pointer-events", "auto", "important");
    promo.style.setProperty("transform", "translateX(0) scale(1)", "important");
  }

  function clearPromoTimers() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    showTimer = null;
    hideTimer = null;
  }

  function startPromoCycle() {
    clearPromoTimers();
    forceHide();

    showTimer = setTimeout(() => {
      forceShow();

      hideTimer = setTimeout(() => {
        forceHide();

        if (isInPlanes && !closedManually) {
          startPromoCycle();
        }
      }, 4000);
    }, 5000);
  }

  function stopPromoCycle() {
    clearPromoTimers();
    forceHide();
  }

  closeBtn?.addEventListener("click", () => {
    closedManually = true;
    promo.classList.add("promo-closed");
    stopPromoCycle();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isInPlanes = Boolean(entry && entry.isIntersecting);

      if (closedManually) return;

      if (isInPlanes) {
        startPromoCycle();
      } else {
        stopPromoCycle();
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(planes);
  forceHide();
})();
