// Cambiá este número por tu WhatsApp.
// Formato recomendado para Argentina: 549 + código de área + número, sin espacios.
// Ejemplo ficticio: 5491123456789
const WHATSAPP_NUMBER = "549XXXXXXXXXX";

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
    const detalle = document.getElementById("detalle")?.value.trim() || "";

    const mensaje = `Hola, quiero pedir un presupuesto.%0A%0A` +
      `Nombre: ${encodeURIComponent(nombre)}%0A` +
      `Equipo: ${encodeURIComponent(equipo)}%0A` +
      `Zona: ${encodeURIComponent(zona)}%0A` +
      `Servicio: ${encodeURIComponent(servicio)}%0A` +
      `Detalle: ${encodeURIComponent(detalle || "No especificado")}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
  });
}
