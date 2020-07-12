const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu } = electron;
const { dialog } = require('electron').dialog
let ventanaPrincipal;

// iniciar la app
app.on('ready', function () {
    ventanaPrincipal = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //cargar html en la ventana
    ventanaPrincipal.loadURL(url.format({
        pathname: path.join(__dirname, 'ventanaPrincipal.html'),
        protocol: 'file',
        slashes: true
    }));
    //crear menu desde template
    const menuPrincipal = Menu.buildFromTemplate(menuPrincipalTemplate);
    //Insertar Menu
    Menu.setApplicationMenu(menuPrincipal);
    //permitir acceso a modulos de node
    
});

function crearNuevaVentana() {
    nuevaVentana = new BrowserWindow({});
    //cargar html en la ventana
    nuevaVentana.loadURL(url.format({
        width: 300,
        height: 200,
        title: 'Nueva ventana'
    }));

    nuevaVentana.on('close', function () {
        nuevaVentana = null;
    })

}
//crear menu
const menuPrincipalTemplate = [
    {
        label: 'Herramientas de Desarrollador',
        submenu: [
            {
                label: 'Activar Devtools',
                accelerator : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]

    }
]






