'use strict';

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const locals = {};
const pug = require('electron-pug')({pretty: true}, locals);
const path = require('path')
const url = require('url')

var mainWindow = null;

function createWindow () {
   mainWindow = new BrowserWindow({width: 800 + 198, height: 800 + 56, resizable: false, autoHideMenuBar: true})
   mainWindow.setMenu(null);
 
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.pug'),
      protocol: 'file:',
      slashes: true
    }))

  mainWindow.on('closed', () => {
   
    mainWindow = null
  
  })
  
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {

    app.quit()

})

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow()
  }

})