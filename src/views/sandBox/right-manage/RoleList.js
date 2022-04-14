import React,{useState,useEffect} from 'react'
import { Table,Button,Modal,Tree } from 'antd';
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource,setDataSource]=useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rightList,setRightList]=useState([])
  const [currentRights,setcurrentRights]=useState([])
  const [currentId,setcurrentId]=useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title:'操作',
      key: 'action',
      render:(item)=>{
       return <div>
         <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>{confirmMethod(item)}}></Button>
         <Button type='primary' shape="circle" icon={<UnorderedListOutlined />} style={{margin:'0 5px'}} onClick={()=>{
           setIsModalVisible(true)
           setcurrentRights(item.rights)
           setcurrentId(item.id)
         }}></Button>
       </div>
      }
    }
  ];

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
// 关闭弹出框
  const handleOk=()=>{
    setIsModalVisible(false)
    setDataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:8000/roles/${currentId}`,{
      rights:currentRights
    })
  }

  const handleCancel=()=>{
    setIsModalVisible(false)
  }

  const deleteMethods=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`http://localhost:8000/roles/${item.id}`)
  }

  const onCheck=(checkKeys)=>{
    setcurrentRights(checkKeys.checked)
  }

  useEffect(()=>{
    axios.get("http://localhost:8000/roles").then((res)=>{
      setDataSource(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then((res)=>{
      setRightList(res.data)
    })
  },[])
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{
        pageSize:5
      }}/>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
        checkable
        checkedKeys={currentRights}
        onCheck={onCheck}
        checkStrictly={true}
        treeData={rightList}
      />
      </Modal>
    </div>
  )
}