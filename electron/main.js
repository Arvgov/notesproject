const { dialog, app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  global.mainWin = win

  // and load the index.html of the app
  console.log(win)
  win.loadFile('index.html')
}

function unusedName() {
    var i = 1
    name = path.join(app.getPath('documents'), "note" + i.toString() + ".nt")
    while (fs.existsSync(name)) {
        i += 1
        name = path.join(app.getPath('documents'), "note" + i.toString() + ".nt")
    }
    return name
}

ipcMain.on('save-document', (event, data) => {
    savePath = dialog.showSaveDialogSync({
        title: "Save notes", defaultPath: unusedName()
    })
    if (savePath !== undefined) {
        console.log(savePath)
        fs.writeFileSync(savePath, JSON.stringify(data));
    }
});

ipcMain.on('load-document', (event) => {
    loadPath = dialog.showOpenDialogSync({
        title: "Open notes", defaultPath: app.getPath('documents')
    })
    if (loadPath !== undefined) {
        let data = JSON.parse(fs.readFileSync(loadPath[0]))
        event.reply("load-document", data)
    } else {
        event.reply("load-document", null)
    }
});

var fullscreen = false
ipcMain.on('toggle-fullscreen', () => {
    fullscreen = !fullscreen
    console.log(win)
    win.setFullscreen(fullscreen)
});

app.whenReady().then(createWindow)


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
