// ==================================================================
// SCRIPT.JS - VERSIÓN "ARRANQUE A PRUEBA DE BALAS"
// ==================================================================

// 1. Definimos el objeto principal de nuestra aplicación
const App = {
    // 2. El método de inicialización. Se llama al final del archivo.
    initialize: function() {
        // 3. Le decimos que escuche el evento 'deviceready'.
        //    'bindEvents' asegura que 'this' se refiera a 'App'.
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // 4. Este método se ejecuta CUANDO el dispositivo está listo.
    onDeviceReady: function() {
        console.log("Dispositivo listo. Iniciando la UI...");
        // 5. Llamamos a la función que realmente construye la interfaz.
        this.run();
    },

    // 6. Aquí está toda la lógica de nuestro escritorio.
    run: function() {
        const desktop = document.getElementById('desktop');
        const startOrb = document.getElementById('start-orb');
        const startMenu = document.getElementById('start-menu');
        const desktopIconsContainer = document.getElementById('desktop-icons');
        const clockElement = document.getElementById('clock');

        function launchApp(packageName, appLabel) {
            if (window.plugins && window.plugins.intent) {
                window.plugins.intent.startActivity({ 'packageName': packageName },
                    () => console.log(`App ${appLabel} lanzada.`),
                    () => alert(`Error al lanzar ${appLabel}.`)
                );
            } else {
                alert(`Funcionalidad para lanzar "${appLabel}" solo disponible en la APK.`);
            }
        }

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

        function updateClock() {
            const now = new Date();
            clockElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }

        startOrb.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('hidden');
        });
        desktop.addEventListener('click', () => startMenu.classList.add('hidden'));
        
        setInterval(updateClock, 1000);
        updateClock();

        if (window.plugins && window.plugins.applist) {
            window.plugins.applist.getApps(
                (apps) => populateUI(apps),
                (error) => console.error('Error al obtener apps:', error)
            );
        } else {
            alert("Error: El plugin 'applist' no funciona.");
        }
    }
};

// 7. ¡ARRANCAMOS! Le damos la patada inicial a la aplicación.
App.initialize();
