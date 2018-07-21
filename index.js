const electron = require('electron');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    // Main window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // Event
    mainWindow.on('closed', () => app.quit());

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
    // Optimisation for garbage collection
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

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

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'DEV',
        submenu: [{
                label: 'Dev tools',
                accelerator: process.platform !== 'darwin' ? 'Ctrl+Alt+D' : 'Command+Alt+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}