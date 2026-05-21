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


// Planes: centrado suave en móvil
const plansTrack = document.querySelector("#planes .plans-grid");

if (plansTrack) {
  const planCards = Array.from(plansTrack.querySelectorAll(".plan-card"));
  let snapTimeout;

  function getClosestPlan() {
    const trackRect = plansTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closest = null;
    let closestDistance = Infinity;

    planCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = card;
      }
    });

    return closest;
  }

  function centerClosestPlan() {
    if (window.innerWidth > 619 || planCards.length === 0) return;

    const closest = getClosestPlan();
    if (!closest) return;

    planCards.forEach((card) => card.classList.remove("is-centered"));
    closest.classList.add("is-centered");

    closest.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }

  function schedulePlanSnap() {
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(centerClosestPlan, 130);
  }

  plansTrack.addEventListener("scroll", schedulePlanSnap, { passive: true });
  plansTrack.addEventListener("touchend", () => setTimeout(centerClosestPlan, 160), { passive: true });
  plansTrack.addEventListener("mouseup", () => setTimeout(centerClosestPlan, 120));

  window.addEventListener("resize", schedulePlanSnap);

  setTimeout(centerClosestPlan, 450);
}
