const routes: RouteConfig[] = [
  {
    key: 'Site',
    path: '/site',
    windowOptions: {
      title: 'Site',
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
