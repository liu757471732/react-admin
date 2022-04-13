import React,{useEffect,useState} from 'react'
import { Menu,Layout } from 'antd';
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import './SideMenu.css'
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const {  Sider } = Layout;

const iconList={
  "/home":<UserOutlined/>,
  "/user-manage/list":<UserOutlined/>,
  "/user-manage/role/list":<UserOutlined/>,
  "/user-manage/right/list":<UserOutlined/>
}


 function SideMenu(props) {
   const [menuList,setMenuList]=useState([])
  const selectKeys=[props.location.pathname]
  const openKsys=["/"+props.location.pathname.split('/')[1]]

  useEffect(()=>{
    axios.get('http://localhost:8000/rights?_embed=children').then((res)=>{
      setMenuList(res.data)
    }).catch((error)=>{
      console.log(error)
    })
  },[])


  const renderMent=(menuList)=>{

    // eslint-disable-next-line array-callback-return
    return menuList.map((el)=>{
      if(el.children && el.children.length>0){
        return <SubMenu key={el.key} icon={iconList[el.key]} title={el.title}>
          {renderMent(el.children)}
        </SubMenu>
      }else{
        return <Menu.Item key={el.key} icon={iconList[el.key]} onClick={()=>{
          props.history.push(el.key)
        }}>{el.title}</Menu.Item>
      }
    })
  }

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{display:'flex',height:'100%',flexDirection:"column"}}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{flex:'1','overflow':'auto'}}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys} defaultOpenKeys={openKsys}>
            {renderMent(menuList)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
