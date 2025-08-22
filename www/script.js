// Versión 6 - Lista para APK
console.log("Adaptive Movil PC - v6 Loaded");

// --- PREVENCIÓN DE COMPORTAMIENTOS NATIVOS ---
window.addEventListener('contextmenu', e => e.preventDefault()); // No al menú contextual
window.addEventListener('wheel', e => e.preventDefault(), { passive: false }); // No al scroll

// --- LÓGICA DE VENTANAS ---
document.querySelectorAll('.window').forEach(windowElement => {
  const titleBar = windowElement.querySelector('.title-bar');
  let active = false;
  let xOffset = 0,
    yOffset = 0;
  let initialX, initialY;
  
  function dragStart(e) {
    if (e.target.closest('.window-controls')) return;
    
    // Usamos 'getBoundingClientRect' para obtener la posición inicial
    const rect = windowElement.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;
    
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      e.preventDefault();
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    active = true;
  }
  
  function dragEnd() {
    active = false;
  }
  
  function drag(e) {
    if (active) {
      let currentX, currentY;
      if (e.type === "touchmove") {
        e.preventDefault();
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }
      // Movemos la ventana actualizando 'left' y 'top'
      windowElement.style.left = `${currentX}px`;
      windowElement.style.top = `${currentY}px`;
    }
  }
  
  // Eventos Táctiles
  titleBar.addEventListener("touchstart", dragStart, { passive: false });
  document.addEventListener("touchend", dragEnd);
  document.addEventListener("touchmove", drag, { passive: false });
  
  // Eventos de Mouse
  titleBar.addEventListener("mousedown", dragStart);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("mousemove", drag);
  
  // --- Lógica de Botones ---
  const closeButton = windowElement.querySelector('.close');
  closeButton.addEventListener('click', () => windowElement.style.display = 'none');
});

// --- LÓGICA DEL RELOJ ---
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();