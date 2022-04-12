import React from 'react'
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/login/Login'
import NewSandBox from '../views/sandBox/SandBox'

export default function Router(){
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/" render={()=>{
          return localStorage.getItem("token")?
          <NewSandBox></NewSandBox>:
          <Redirect to="/login"></Redirect>
        }}></Route>
      </Switch>
    </HashRouter>
  )
}