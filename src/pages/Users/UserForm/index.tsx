
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Modal, Table, Tag, Space, Button, Form, Input, Badge } from 'antd';
import { getUserDetailById, deleteUser, sendPasswordResetLink } from 'api/api-user';
import { Link } from 'react-router-dom';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import config from 'api/config';

const confirm = Modal.confirm;

const ActionCell = ({ item, onChange }: any) => {
	const [userInfo, setUserInfo] = useState(item);
	const [isRequesting, setIsRequesting] = useState(false);

	const onClickBtn = () => {
		
        confirm({
			centered:true,
            title: 'Are you sure you want to delete this user?',
            okText: 'Delete',
            okType: 'default',
            cancelText: 'No, do not delete',
            okButtonProps:{
                style:{
                    backgroundColor:'#fff'
                }
            },
            cancelButtonProps: {
                style:{
                    backgroundColor:'#0ab068', color:'#fff'
                }
            },
            onOk() {
                console.log('OK');
                setIsRequesting(true);
                deleteUser(userInfo.id).then(()=>{
                    setIsRequesting(false);
                });
                onChange();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
	};
	
	const onClicEmailBtn = () => {
		setIsRequesting(true);
		sendPasswordResetLink(userInfo.email).then(res=>{
			onChange();
		}).catch((err)=>{
			console.log(err);
		});
	};

	return (
		<Space size="middle">
			{!userInfo.email_verified_at && <Button loading={isRequesting} icon={<MailOutlined />} onClick={onClicEmailBtn}>
				Send Reset Password Email
			</Button>
			}
			<Button loading={isRequesting} icon={<CloseCircleOutlined />} onClick={onClickBtn}>
			</Button>
		</Space>
	);
};

const Index = ({match}:any) => {

    const userId = match.params.userId;

    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'user_name',
		},
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Visited',
			key: 'visited',
			render:(value:any, record:any) =>(
				<div>{record.visited.length}</div>
			)
		},
		{
			title: 'Wishlist',
			key: 'wishlist',
			render:(value:any, record:any) =>(
				<div>{record.wishlist.length}</div>
			)
		},
		{
			title: 'Reviews',
			key: 'reviews',
			render:(value:any, record:any) =>(
				<div>{record.comments.length}</div>
			)
		},
		{
			title: 'Email Verified',
			key: 'email_verified_at',
			render:(value:any, record:any) =>{
				let badgeType:any = 'default';
				let badgeTxt = record.status;

				if(badgeTxt == 'pending'){
					badgeType = 'processing';
				}

				if(record.email_verified_at){
					badgeType = 'success';
					badgeTxt = 'verified';
				}
				return (<Badge status={badgeType} text = {badgeTxt}/> );
			}
		},
		{
			title: 'Email Address',
			dataIndex: 'email',
			key: 'user_email',
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (text: string, record: any) => (
				<ActionCell item={record} onChange={() => loadTable()} />
			),
		},
	];

    const [tableData, setTableData] = useState<any[]>([]);

    useEffect(()=>{
        loadTable();
    }, [userId]);

    const loadTable = ()=>{
        if(userId){
            getUserDetailById(userId).then((res:any)=>{
                if(res.body){
                    setTableData([res.body]);
                }
            }).catch((err:any)=>{
                console.log(err);
            });
        }
	};

    if(tableData.length){
        return (
            <Card title = {<span style = {{fontWeight:'bold'}}>{tableData[0].name}</span>} extra = {<Button style = {{backgroundColor:'#0ab068', color:'#fff'}} onClick = {()=>{
                window.open(`${config.fontend}/uzytkownik/${tableData[0].guid}`, '_blank');
            }}>Visit Profile</Button>} bodyStyle = {{padding:0}}>
                <Table columns={columns} dataSource={tableData} pagination = {false}/>
            </Card>
        );
    }
    return null;
};

export default Index;