document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log("Puente a Android ABIERTO. Iniciando Adaptive Movil PC...");

    // --- ELEMENTOS ---
    const desktop = document.getElementById('desktop');
    const startOrb = document.getElementById('start-orb');
    const startMenu = document.getElementById('start-menu');
    const desktopIconsContainer = document.getElementById('desktop-icons');
    const clockElement = document.getElementById('clock');

    // --- LÓGICA DE APPS NATIVAS ---
    function launchApp(packageName, appLabel) {
        console.log(`Intentando lanzar: ${packageName}`);
        if (window.plugins && window.plugins.intent) {
            window.plugins.intent.startActivity(
                { 'packageName': packageName },
                () => console.log(`App ${appLabel} lanzada con éxito.`),
                () => alert(`Error al lanzar ${appLabel}.`)
            );
        } else {
            alert(`Funcionalidad para lanzar "${appLabel}" solo disponible en la APK.`);
        }
    }

    // --- LÓGICA DE CONSTRUCCIÓN DE UI ---
    function createDesktopIcon(app) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'desktop-icon';
        iconDiv.innerHTML = `<img src="data:image/png;base64,${app.icon}" alt="${app.label}"><span>${app.label}</span>`;
        iconDiv.addEventListener('dblclick', () => launchApp(app.packageName, app.label));
        desktopIconsContainer.appendChild(iconDiv);
    }

    function createStartMenuItem(app) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'start-menu-item';
        itemDiv.innerHTML = `<img src="data:image/png;base64,${app.icon}" alt="${app.label}"><span>${app.label}</span>`;
        itemDiv.addEventListener('click', () => {
            launchApp(app.packageName, app.label);
            startMenu.classList.add('hidden');
        });
        startMenu.appendChild(itemDiv);
    }

    function populateUI(apps) {
        desktopIconsContainer.innerHTML = '';
        startMenu.innerHTML = '';
        apps.sort((a, b) => a.label.localeCompare(b.label));
        apps.forEach(app => {
            createDesktopIcon(app);
            createStartMenuItem(app);
        });
    }

    // --- LÓGICA DEL RELOJ ---
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }

    // --- INICIO DEL SISTEMA ---
    startOrb.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
    });
    desktop.addEventListener('click', () => startMenu.classList.add('hidden'));
    
    setInterval(updateClock, 1000);
    updateClock();

    // --- ¡ACCIÓN! OBTENER Y MOSTRAR LAS APPS ---
    if (window.plugins && window.plugins.applist) {
        window.plugins.applist.getApps(
            (apps) => {
                console.log(`Se encontraron ${apps.length} aplicaciones.`);
                populateUI(apps);
            },
            (error) => {
                console.error('Error al obtener la lista de apps:', error);
                alert("No se pudo obtener la lista de aplicaciones. Revisa los permisos.");
            }
        );
    } else {
        alert("Error crítico: El plugin 'applist' no funciona. La APK no se compiló correctamente.");
    }
} // <-- ¡AQUÍ ESTABA EL ERROR! FALTABA ESTE '}'
