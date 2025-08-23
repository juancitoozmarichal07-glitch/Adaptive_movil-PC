// ==================================================================
// COMIENZO DEL ARCHIVO SCRIPT.JS (VERSIÓN RECONSTRUIDA)
// ==================================================================

// --- MÓDULO DE DETECCIÓN DE HARDWARE ---
const HardwareDetector = {
    mouseDetected: false, keyboardDetected: false,
    start(onSuccess) {
        this.onSuccess = onSuccess;
        this.promptMessage = document.getElementById('prompt-message');
        this.mouseStatus = document.getElementById('mouse-status');
        this.keyboardStatus = document.getElementById('keyboard-status');
        document.getElementById('connection-prompt').style.display = 'flex';
        this.updatePromptMessage();
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    },
    onMouseMove() {
        if (this.mouseDetected) return; this.mouseDetected = true;
        this.mouseStatus.classList.add('detected'); this.checkCompletion();
    },
    onKeyDown() {
        if (this.keyboardDetected) return; this.keyboardDetected = true;
        this.keyboardStatus.classList.add('detected'); this.checkCompletion();
    },
    updatePromptMessage() {
        if (!this.mouseDetected && !this.keyboardDetected) { this.promptMessage.textContent = "Por favor, conecta y usa un teclado y un ratón."; }
        else if (!this.mouseDetected) { this.promptMessage.textContent = "Falta detectar el ratón. ¡Muévelo!"; }
        else { this.promptMessage.textContent = "Falta detectar el teclado. ¡Presiona una tecla!"; }
    },
    checkCompletion() {
        if (this.mouseDetected && this.keyboardDetected) {
            this.promptMessage.textContent = "¡Dispositivos detectados! Por favor, espere...";
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('keydown', this.onKeyDown);
            const prompt = document.getElementById('connection-prompt');
            prompt.style.transition = 'opacity 0.5s ease';
            prompt.style.opacity = '0';
            setTimeout(() => {
                prompt.style.display = 'none'; this.onSuccess();
            }, 1000);
        } else { this.updatePromptMessage(); }
    }
};

// --- INICIO DE LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    HardwareDetector.start(() => {
        document.addEventListener('deviceready', main, false);
        setTimeout(() => {
            if (!window.isAppReady) {
                console.warn("El evento 'deviceready' no se disparó. Forzando inicio en MODO DE PRUEBA.");
                main();
            }
        }, 2000);
    });
});

// ==================================================================
//  FUNCIÓN PRINCIPAL DEL ESCRITORIO "ADAPTIVE MOVIL PC"
// ==================================================================

function main() {
    if (window.isAppReady) return;
    window.isAppReady = true;
    console.log('Iniciando el entorno de escritorio...');

    // --- DEFINICIÓN DE ELEMENTOS GLOBALES ---
    const desktop = document.getElementById('desktop');
    const desktopIconsContainer = document.getElementById('desktop-icons');
    const startOrb = document.getElementById('start-orb');
    const startMenu = document.getElementById('start-menu');
    const clock = document.getElementById('clock');
    let openWindowId = 0;
    let highestZIndex = 100;

    // --- LÓGICA DE VENTANAS ---
    function createWindow(title, contentHTML, options = {}) {
        openWindowId++;
        const windowId = `window-${openWindowId}`;
        const win = document.createElement('div');
        win.id = windowId;
        win.className = 'window';
        win.style.width = options.width || '400px';
        win.style.height = options.height || '300px';
        win.style.top = `${50 + (openWindowId % 10) * 20}px`;
        win.style.left = `${100 + (openWindowId % 10) * 20}px`;
        highestZIndex++;
        win.style.zIndex = highestZIndex;
        win.innerHTML = `<div class="title-bar"><span class="title">${title}</span><div class="window-controls"><button class="close">X</button></div></div><div class="content">${contentHTML}</div>`;
        desktop.appendChild(win);
        
        // ¡CORRECCIÓN! Aplicamos la lógica de arrastre y cierre a la nueva ventana.
        makeDraggable(win);
        win.querySelector('.close').addEventListener('click', () => win.remove());
        
        return win;
    }

    function makeDraggable(element) {
        const handle = element.querySelector('.title-bar');
        if (!handle) return; // No hacer nada si no hay barra de título
        let isDragging = false, offsetX, offsetY;
        const startDrag = (e) => {
            isDragging = true;
            highestZIndex++;
            element.style.zIndex = highestZIndex;
            const rect = element.getBoundingClientRect();
            offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
            offsetY = (e.clientY || e.touches[0].clientY) - rect.top;
        };
        const drag = (e) => {
            if (isDragging) {
                element.style.left = `${(e.clientX || e.touches[0].clientX) - offsetX}px`;
                element.style.top = `${(e.clientY || e.touches[0].clientY) - offsetY}px`;
            }
        };
        const stopDrag = () => { isDragging = false; };
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    // --- LÓGICA DE APLICACIONES ---
    function launchApp(packageName, appLabel) {
        if (packageName.startsWith('internal.')) {
            const appName = packageName.split('.')[1];
            if (appName === 'notepad') {
                createWindow('Bloc de Notas', '<textarea placeholder="Escribe algo aquí..."></textarea>', { width: '450px', height: '350px' });
            } else if (appName === 'calculator') {
                const content = `<div class="calculator-grid">...</div>`; // El HTML de tu calculadora
                createWindow('Calculadora', content, { width: '240px', height: '320px' });
            }
        } else {
            alert(`Lanzar app nativa: ${appLabel}\n(Funcionalidad pendiente)`);
        }
    }

    // --- LÓGICA DE ICONOS ---
    function createDesktopIcon(appData) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'desktop-icon';
        const iconSrc = appData.packageName.startsWith('internal.') ? appData.icon : `data:image/png;base64,${appData.icon}`;
        iconDiv.innerHTML = `<img src="${iconSrc}" alt="${appData.label}"><span>${appData.label}</span>`;
        iconDiv.addEventListener('dblclick', () => launchApp(appData.packageName, appData.label));
        desktopIconsContainer.appendChild(iconDiv);
    }

    function populateDesktop() {
        desktopIconsContainer.innerHTML = '';
        createDesktopIcon({ label: 'Bloc de Notas', packageName: 'internal.notepad', icon: 'img/icon_notepad.png' });
        createDesktopIcon({ label: 'Calculadora', packageName: 'internal.calculator', icon: 'img/icon_calculator.png' });
        if (window.plugins && window.plugins.applist) {
            window.plugins.applist.getApps(
                (apps) => { apps.forEach(app => createDesktopIcon(app)); },
                (error) => { console.error('Error al obtener apps:', error); }
            );
        } else {
            console.warn("MODO DE PRUEBA: No se pueden cargar apps nativas.");
        }
    }

    // --- INICIALIZACIÓN DEL ESCRITORIO ---
    function initializeDesktop() {
        // Configurar eventos de la UI
        startOrb.addEventListener('click', (e) => { e.stopPropagation(); startMenu.classList.toggle('hidden'); });
        desktop.addEventListener('click', () => { startMenu.classList.add('hidden'); });
        
        // Iniciar Reloj
        const updateClock = () => {
            const now = new Date();
            clock.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        };
        updateClock();
        setInterval(updateClock, 1000);
        
        // ¡Poblar el escritorio! Esta es la llamada clave.
        populateDesktop();
    }

    // --- ¡ARRANQUE! ---
    initializeDesktop();
}
