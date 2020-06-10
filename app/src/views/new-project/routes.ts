const routes: RouteConfig[] = [
  {
    key: 'NewProject',
    path: '/new-project',
    windowOptions: {
      title: 'NewProject',
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
