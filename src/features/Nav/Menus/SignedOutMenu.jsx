import React from 'react'
import {Menu  , Button } from 'semantic-ui-react';
const SignedOutMenu = ({signin,register}) => {
  return (
      <Menu.Item position="right">
                    <Button onClick={ signin } basic inverted content="Login" title='Đăng Nhập' />
                    <Button onClick={ register } basic inverted content="Register" title="Tạo Tài Khoản" style={{marginLeft: '0.5em'}} />
        </Menu.Item>
  )
}

export default SignedOutMenu
