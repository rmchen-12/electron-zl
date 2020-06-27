const routes: RouteConfig[] = [
  {
    key: 'Administrator',
    path: '/administrator',
    windowOptions: {
      title: 'Administrator',
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      width: 300,
      height: 240,
    },
    createConfig: {
      showTitlebar: false,
      hideMenus: true,
    },
  },
]

export default routes
