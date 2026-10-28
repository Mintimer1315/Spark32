const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("spark32", {
  platform: process.platform,
});
