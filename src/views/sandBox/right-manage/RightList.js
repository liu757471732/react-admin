import React,{useState,useEffect} from 'react'
import { Table,Tag,Button,Modal } from 'antd';
import axios from 'axios';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;


export default function RightList() {
  const [dataSource,setDataSource]=useState([])
  const [columns]=useState([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render:(key)=>{
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)}></Button>
          <Button type='primary' shape="circle" icon={<EditOutlined/>}></Button>
        </div>
      }
    }
  ])

  const confirmMethod=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log(dataSource)  
        deleteMethods(item)
        // console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethods=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
  }
  
  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then((res)=>{
      const list=res.data
      list[0].children=""
      setDataSource(list)
    })
  },[])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize:5
      }}/>
    </div>
  )
}
