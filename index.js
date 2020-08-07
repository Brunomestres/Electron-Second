const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let commentWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed',() => app.quit());
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

})

function createComment()
{
  commentWindow = new BrowserWindow({
    width: 500,
    height: 300,
    title: 'Novo Comentário',
    webPreferences: {
      nodeIntegration: true
    }
  });
  commentWindow.loadURL(`file://${__dirname}/comment.html`);
  commentWindow.on('closed', () => commentWindow = null );
}

ipcMain.on('addComment', ( event, comment) => {
  mainWindow.webContents.send('addComment', comment);
  commentWindow.close();
});

const menuTemplate = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Adicionar Comentário',
        accelerator: 'Alt+n',
        click(){
          createComment();
        }
      },
      {
        label: 'Sair da Aplicção',
        accelerator: 'Alt+F4',
        click(){
          app.quit();
        }
      }
    ]
  }
]

if(process.env.NODE_ENV !== 'production')
{
  menuTemplate.push({
    label: 'Dev',
    submenu: [
      { role: 'reload'},
      {
        label: 'Debug',
        accelerator: 'Ctrl+Shift+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        },
        
      }
    ]
  })
}