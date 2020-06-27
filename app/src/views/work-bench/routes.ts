const routes: RouteConfig[] = [
  {
    key: 'WorkBench',
    path: '/work-bench',
    windowOptions: {
      title: 'WorkBench',
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
