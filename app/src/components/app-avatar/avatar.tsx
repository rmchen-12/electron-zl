import React, { Component } from 'react'
import { Avatar } from 'antd'
import './avatar.less'

interface UserAvatarProps {
  src: string
  accessLevel?: getUserInfoUsingGET.accessLevel
  onClick?: () => void
  className?: string
}

export class UserAvatar extends Component<UserAvatarProps, {}> {
  render() {
    const { src, accessLevel, onClick, className } = this.props

    return (
      <div className={`app-avatar flex column center-v ${className}`} onClick={onClick}>
        {accessLevel === '400' && <i className="ri-seedling-line text-success fs-16"></i>}
        {accessLevel === '500' && <i className="ri-cake-2-line text-error fs-16"></i>}
        <Avatar src={src} size="large"></Avatar>
      </div>
    )
  }
}
