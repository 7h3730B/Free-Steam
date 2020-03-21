const electron  = require('electron');

class FreeGamesWindow extends electron.BrowserWindow{
    constructor(width, height){
        super({
            width, 
            height,
            webPreferences: {
                nodeIntegration: true,
            },
        });
    }
}

module.exports = FreeGamesWindow;