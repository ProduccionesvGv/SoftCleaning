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
`.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, "_blank");
  });
}


