import React,{useState} from 'react'
import { Layout,Dropdown,Menu,Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
const { Header } = Layout;


export default function TopHeader() {
  const [collapsed,setCollapsed]=useState(false)
  const changeCollapsed=()=>{
    setCollapsed(!collapsed)
  }
  const history=useHistory()
  const menu = (
    <Menu>
      <Menu.Item>
        超级管理员
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
        localStorage.removeItem('token')
        history.push("/login")
      }}>退出</Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: this.toggle,
      })} */}
      {
        collapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{'float':'right'}}>
        <span>欢迎admin回来</span>
        <Dropdown overlay={menu}>
            <Avatar src="https://joeschmoe.io/api/v1/random" style={{marginLeft:'14px'}}/>
        </Dropdown>
      </div>
    </Header>
)
}
