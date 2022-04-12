import React from "react";
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from "./home/Home";
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from './nopermission/Nopermission'

export default function SandBox(){
  return (
    <div>
      <SideMenu></SideMenu>
      <TopHeader></TopHeader>
      
      <Switch>
        <Route path="/home" component={Home}></Route>
        <Route path="/user-manage/list" component={UserList}></Route>
        <Route path="/right-manage/role/list" component={RoleList}></Route>
        <Route path="/right-manage/right/list" component={RightList}></Route>
        <Redirect from="/" to="/home" exact></Redirect>
        <Route path="*" component={NoPermission}></Route>
      </Switch>
    </div>
  )
}