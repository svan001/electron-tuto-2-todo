const electron = require('electron');

const {
    app,
    BrowserWindow,
    Menu
} = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    // Main window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // Menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        title: 'Add new Todo',
        width: 300,
        height: 200
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
}


const menuTemplate = [
    // First dropDown menu
    {
        label: 'File',
        submenu: [{
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                // 'Ctrl+Q' direct or ( () => {} )()
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command+Q';
                    } else {
                        return 'Ctrl+Q';
                    }
                })(),
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    // Add emtpy object in first position for mac compatibility
    menuTemplate.unshift({});
}