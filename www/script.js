document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    let openWindows = 0; // Contador para IDs únicos de ventanas

    // --- LÓGICA DEL MENÚ INICIO ---
    startButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic se propague al escritorio
        startMenu.classList.toggle('hidden');
    });

    // Ocultar el menú si se hace clic en cualquier otro lugar
    document.addEventListener('click', () => {
        if (!startMenu.classList.contains('hidden')) {
            startMenu.classList.add('hidden');
        }
    });

    // --- LÓGICA PARA CREAR APLICACIONES ---
    startMenu.addEventListener('click', (event) => {
        if (event.target.classList.contains('start-menu-item')) {
            const appName = event.target.getAttribute('data-app');
            if (appName === 'notepad') {
                createWindow('Bloc de Notas', '<textarea placeholder="Escribe algo aquí..."></textarea>');
            }
            // Ocultamos el menú después de abrir la app
            startMenu.classList.add('hidden');
        }
    });

    function createWindow(title, contentHTML) {
        openWindows++;
        const windowId = `window-${openWindows}`;

        const newWindow = document.createElement('div');
        newWindow.id = windowId;
        newWindow.className = 'window';
        newWindow.style.top = `${30 + (openWindows * 10)}px`;
        newWindow.style.left = `${50 + (openWindows * 10)}px`;

        newWindow.innerHTML = `
            <div class="title-bar">
                <span class="title">${title}</span>
                <div class="window-controls">
                    <button class="minimize">-</button>
                    <button class="maximize">[]</button>
                    <button class="close">X</button>
                </div>
            </div>
            <div class="content">
                ${contentHTML}
            </div>
        `;

        desktop.appendChild(newWindow);
        addWindowEvents(newWindow);
    }

    function addWindowEvents(windowElement) {
        const titleBar = windowElement.querySelector('.title-bar');
        const closeButton = windowElement.querySelector('.close');

        // --- Lógica para cerrar la ventana ---
        closeButton.addEventListener('click', () => {
            windowElement.remove(); // Ahora simplemente la borramos del DOM
        });

        // --- Lógica de arrastre (eventos de mouse y táctiles) ---
        let isDragging = false;
        let offsetX, offsetY;

        const startDrag = (clientX, clientY) => {
            isDragging = true;
            const rect = windowElement.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            windowElement.style.cursor = 'grabbing';
        };

        const drag = (clientX, clientY) => {
            if (isDragging) {
                windowElement.style.left = `${clientX - offsetX}px`;
                windowElement.style.top = `${clientY - offsetY}px`;
            }
        };

        const stopDrag = () => {
            isDragging = false;
            windowElement.style.cursor = 'default';
        };

        // Eventos de Mouse
        titleBar.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => drag(e.clientX, e.clientY));
        document.addEventListener('mouseup', stopDrag);

        // Eventos Táctiles
        titleBar.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                drag(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    // --- LÓGICA DEL RELOJ (sin cambios) ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}`;
    }
    setInterval(updateClock, 1000);
    updateClock();
});
