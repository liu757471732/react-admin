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
  const [isUpdateVisible,setIsUpdateVisible]=useState(false)
  const [isUpdateDisabled,setIsUpdateDisabled]=useState(false)
  const [current,setCurrent]=useState(null)
  const addForm=useRef(null)
  const updateForm=useRef(null)
  const columns=[
    {
      title: '区域',
      dataIndex: 'region',
      render:(region)=>{
        return <b>{region?region:'全球'}</b>
      },
      filters:[
        ...regionList.map(item=> {return {
          text:item.title,
          value:item.value
        }}),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter: (value, record) => {
        console.log(value==="全球")
        if(value==="全球"){
          return record.region===""
        }else{
          return record.region.startsWith(value)
        }
      },
      width: '30%',
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
        return <Switch checked={roleState} disabled={item.default} onChange={()=>{handleChange(item)}}></Switch>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)} disabled={item.default}></Button>
          <Button type='primary' shape="circle" icon={<EditOutlined/>} disabled={item.default}onClick={()=>handleClick(item)}></Button>
        </div>
      }
    }
  ]
  const handleClick=(item)=>{
    setTimeout(()=>{
      if(item.roleId===1){
        setIsUpdateDisabled(true)
      }else{
        setIsUpdateDisabled(false)
      }
      setIsUpdateVisible(true)
      updateForm.current.setFieldsValue(item)
    },0)
    setCurrent(item)
  }
  const handleChange=(item)=>{
    item.roleState=!item.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`,{roleState:item.roleState}).then((res)=>{
      console.log(123)
    })
  }

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
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
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
  const addFormOk=()=>{
    addForm.current.validateFields().then((value)=>{
      setIsAddVisible(false)
      addForm.current.resetFields()
      axios.post(`http://localhost:8000/users`,{...value,"roleState":true,"default":false}).then((res)=>{
        setDataSource([...dataSource ,{...res.data,role:roleList.filter(item=>item.id===value.roleId)[0]}])
      })
    }).catch((error)=>{
      console.log(error)
    })
  }

  // 更新
  const updateFormOk=()=>{
    updateForm.current.validateFields().then(value=>{
      setIsUpdateVisible(false)
      setDataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return {
            ...item,
            ...value,
            role:roleList.filter(item=>item.id===value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:8000/users/${current.id}`,value)
    })
  }
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
          addFormOk()
          // addForm.current
        }}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={()=>{
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          updateFormOk()
          // addForm.current
        }}
      >
        <UserForm ref={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  )
}
