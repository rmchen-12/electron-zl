import React, { Component } from 'react'
import './content.less'

import { Project, Npm } from './components'

export class MainContent extends Component {
  render() {
    return (
      <div className="work-bench-content p-16">
        <Project />
        <Npm />
      </div>
    )
  }
}
