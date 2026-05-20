// Cambiá este número por tu WhatsApp.
// Formato recomendado para Argentina: 549 + código de área + número, sin espacios.
// Ejemplo ficticio: 5491123456789
const WHATSAPP_NUMBER = "5491158768929";

// Menú móvil
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

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
    const zona = document.getElementById("zona")?.value || "";
    const servicio = document.getElementById("servicio")?.value || "";
    const detalle = document.getElementById("detalle")?.value.trim() || "No especificado";

    const mensaje = `
*NUEVA CONSULTA - SOFTCLEANING*

━━━━━━━━━━━━━━━━━━━━

*DATOS DEL CLIENTE*

*Nombre:* ${nombre}
*Equipo:* ${equipo}
*Zona:* ${zona}

━━━━━━━━━━━━━━━━━━━━

*SERVICIO SOLICITADO*

${servicio}

━━━━━━━━━━━━━━━━━━━━

*DETALLE DEL PROBLEMA*

${detalle}

━━━━━━━━━━━━━━━━━━━━
`.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, "_blank");
  });
}
