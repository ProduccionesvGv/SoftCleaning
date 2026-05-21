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







// Mostrar icono promocional solo en Planes
(() => {
  const promoIcon = document.querySelector(".promo-simple-float");
  const planesSection = document.getElementById("planes");

  if (!promoIcon || !planesSection) return;

  function updatePromoVisibility() {
    const rect = planesSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const isNearPlanes = rect.top < viewportHeight * 0.75 && rect.bottom > viewportHeight * 0.20;

    if (isNearPlanes) {
      promoIcon.classList.add("is-visible");
    } else {
      promoIcon.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", updatePromoVisibility, { passive: true });
  window.addEventListener("resize", updatePromoVisibility);

  updatePromoVisibility();
})();
