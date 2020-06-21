import React from 'react'
import reactDom from 'react-dom'
import { Provider } from 'react-redux'
import { ipcRenderer } from 'electron'

import { initRenderer } from '@/core/renderer.init'
import App from './app'
import '@/src/styles/index.less'

initRenderer()

ipcRenderer.on('dom-ready', (_, createConfig) => {
  reactDom.render(
    <Provider store={$store}>
      <App createConfig={createConfig} />
    </Provider>,
    document.getElementById('app')
  )
})
