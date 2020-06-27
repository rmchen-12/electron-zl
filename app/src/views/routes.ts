const routes: RouteConfig[] = [
  {
    key: 'Home',
    path: '/',
    redirect: { to: '/work-bench?form=home' },
    windowOptions: {
      title: 'swim',
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
    },
    createConfig: {
      showSidebar: true,
      saveWindowBounds: true,
      // openDevTools: true,
    },
  },
]

export default routes
