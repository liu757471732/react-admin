import React,{useState,useEffect,useRef} from 'react'
import { Table,Button,Modal,Switch } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
// 组件
import UserForm from '../../../components/user-manage/UserForm.js'

const { confirm } = Modal;

export default function UserList() {
  const [dataSource,setDataSource]=useState([])
  const [isAddVisible,setIsAddVisible]=useState(false)
  const [roleList,setRoleList]=useState([])
  const [regionList,setRegionList]=useState([])
  const addForm=useRef(null)
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
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)} disabled={item.default}></Button>
          <Button type='primary' shape="circle" icon={<EditOutlined/>} disabled={item.default}></Button>
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
  
  const addUser=()=>{
    setIsAddVisible(true)
  }

  useEffect(()=>{
    axios.get("http://localhost:8000/users?_expand=role").then((res)=>{
      const list=res.data
      setDataSource(list)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/regions").then((res)=>{
      const list=res.data
      setRegionList(list)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/roles").then((res)=>{
      const list=res.data
      setRoleList(list)
    })
  },[])

  return (
    <div>
      <Button type="primary" style={{marginBottom:"20px"}} onClick={()=>{addUser()}}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{
        pageSize:5
      }}/>

      {/* form表单 */}
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setIsAddVisible(false)
        }}
        onOk={() => {
          addForm.current.validateFields().then((res)=>{
            console.log(res)
          }).catch((error)=>{
            console.log(error)
          })
          // addForm.current
        }}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
      </Modal>
    </div>
  )
}
