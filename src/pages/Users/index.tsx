import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Badge } from 'antd';
import { getAll, deleteUser, sendPasswordResetLink } from 'api/api-user';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

import history from 'modules/history';
import { PlaceType } from 'modules/types';
 

const ActionCell = ({ item, onChange }: any) => {
	const [userInfo, setUserInfo] = useState(item);
	const [isRequesting, setIsRequesting] = useState(false);

	const onClickBtn = () => {
		setIsRequesting(true);
		deleteUser(userInfo.id);
		onChange();
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
		</Space>
	);
};


const AllUsers = ({ match }: any) => {

	const [form] = Form.useForm();

    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'user_name',
			render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
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

	const [tableData, setTableData] = useState<PlaceType[]>([]);
	const [tablePaginationOption, setTablePaginationOption] = useState<{total:number, curPage:number, pageSize:number}>({total:0, curPage:1, pageSize:10});

	useEffect(()=>{
		loadTable();
	}, [tablePaginationOption.curPage]);

    const loadTable = async (query='')=>{
		const {pageSize, curPage} = tablePaginationOption;
		console.log('curPage --->', tablePaginationOption);
		const { body } = await getAll(pageSize * (curPage - 1), pageSize, query);
		setTableData(body.data);
		setTablePaginationOption({curPage, pageSize, total:body.total});
	};

	const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		console.log('tablePaginationOption --->', tablePaginationOption);
		setTablePaginationOption({...tablePaginationOption, curPage: pagination.current});
	};

	const onCreateNewUser = () => {
		history.push(`${match.path}/create`);
	};

	const {pageSize, curPage, total} = tablePaginationOption;

	const onFinishSearch = (e:any) => {
		console.log('-----onFinishSearch----', e.target.value);
		loadTable(e.target.value);
	};

    return (
		<>
        <div className='table-header'>
			{/* <Form form={form} style={{ marginTop: 20 }} onFinish={onFinishSearch}> */}
			{/* </Form> */}
			<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
			<Button onClick={onCreateNewUser}>New</Button>
		</div>
		<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />
		</>
    );
};

export default AllUsers;