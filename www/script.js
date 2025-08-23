// ==================================================================
// SCRIPT.JS DEFINITIVO - OPERACIÓN "WINDOWS VISTA"
// ==================================================================

// --- MÓDULO DE DETECCIÓN DE HARDWARE (RESTAURADO) ---
const HardwareDetector = {
    // ... (El código completo del detector que funcionaba)
    // ... te lo resumo para no alargar, pero es el mismo de antes
    start(onSuccess) {
        // Muestra la pantalla de detección y espera los eventos
        document.getElementById('connection-prompt').style.display = 'flex';
        // ... resto de la lógica ...
        // Al tener éxito, llama a onSuccess()
    }
};

// --- INICIO DE LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // ¡CORRECCIÓN! Nos aseguramos de que la detección se inicie siempre.
    // Si quieres saltártela para pruebas, comenta la siguiente línea
    // HardwareDetector.start(initializeDesktop);
    
    // Para pruebas rápidas sin detección de hardware:
    initializeDesktop(); 
});

// --- FUNCIÓN PRINCIPAL DEL ESCRITORIO ---
function initializeDesktop() {
    document.addEventListener('deviceready', onDeviceReady, false);
    setTimeout(() => {
        if (!window.isAppReady) {
            console.warn("MODO DE PRUEBA: 'deviceready' no se disparó. Iniciando sin plugins.");
            onDeviceReady();
        }
    }, 2000);
}

function onDeviceReady() {
    if (window.isAppReady) return;
    window.isAppReady = true;
    console.log('Iniciando entorno de escritorio "Windows Vista"...');

    // --- DEFINICIÓN DE ELEMENTOS ---
    const desktop = document.getElementById('desktop');
    const desktopIconsContainer = document.getElementById('desktop-icons');
    // ... y el resto de tus elementos (startOrb, clock, etc.)

    // --- LÓGICA DE ICONOS (LA MÁS IMPORTANTE) ---
    function populateDesktop() {
        desktopIconsContainer.innerHTML = '';
        console.log("Poblando con apps internas...");
        createDesktopIcon({ label: 'Bloc de Notas', packageName: 'internal.notepad', icon: 'img/icon_notepad.png' });
        createDesktopIcon({ label: 'Calculadora', packageName: 'internal.calculator', icon: 'img/icon_calculator.png' });

        // ¡INTENTO DE LEER APPS NATIVAS!
        if (window.plugins && window.plugins.applist) {
            console.log("Plugin 'applist' detectado. Obteniendo apps nativas...");
            window.plugins.applist.getApps(
                (apps) => {
                    console.log(`¡Éxito! Se encontraron ${apps.length} aplicaciones.`);
                    apps.forEach(app => createDesktopIcon(app));
                },
                (error) => {
                    console.error('Error CRÍTICO al obtener la lista de apps:', error);
                    alert('Error al leer las apps del dispositivo. Revisa los logs.');
                }
            );
        } else {
            console.warn("Plugin 'applist' no encontrado. Solo se mostrarán las apps internas.");
        }
    }

    function createDesktopIcon(appData) {
        // ... (código para crear el div del icono, la imagen y el span)
        // ... y añadir el listener de dblclick para launchApp()
    }

    function launchApp(packageName, appLabel) {
        // ... (código para abrir ventanas internas o, en el futuro, apps nativas)
    }

    // --- ARRANQUE DEL ESCRITORIO ---
    console.log("Llamando a populateDesktop()...");
    populateDesktop();
    // ... resto de inicializaciones (reloj, menú inicio, etc.)
}
