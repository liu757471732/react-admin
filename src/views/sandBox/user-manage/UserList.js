import React,{useState,useEffect} from 'react'
import { Table,Button,Modal,Switch } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;


export default function UserList() {
  const [dataSource,setDataSource]=useState([])
  const columns=[
    {
      title: '区域',
      dataIndex: 'region',
      render:(region)=>{
        return <b>{region?region:'全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState)=>{
        return <Switch checked={roleState}></Switch>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)}></Button>
           <Button type='primary' shape="circle" icon={<EditOutlined/>} ></Button>
        </div>
      }
    }
  ]

  const confirmMethod=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethods(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethods=(item)=>{
    
  }
  

  useEffect(()=>{
    axios.get("http://localhost:8000/users?_expand=role").then((res)=>{
      const list=res.data
      setDataSource(list)
    })
  },[])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{
        pageSize:5
      }}/>
    </div>
  )
}
