import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Badge, Card, Select } from 'antd';
import { getAll, deleteAdmin, sendResetPasswordLink, updateAdminRole } from 'api/api-admin';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

import history from 'modules/history';
import { PlaceType } from 'modules/types';
import classes from './style.module.scss';

const { Option } = Select;

const ActionCell = ({ item, onChange }: any) => {
	const [userInfo, setUserInfo] = useState(item);
	const [isRequesting, setIsRequesting] = useState(false);

	const onClickDeleteBtn = () => {
		setIsRequesting(true);
		deleteAdmin(userInfo.id);
		onChange();
	};

	const onClickSendResetPassLink = () => {
		console.log('--------sendResetPasswordLink----------');
		sendResetPasswordLink(userInfo.email).then((res:any)=>{
			console.log(res);
		}).catch((err:any)=>{
			console.log(err);
		});
	};

	return (
		<Space size="middle">
			<Button loading={isRequesting} onClick={onClickSendResetPassLink}>
				Send Pass Reset Link
			</Button>
			<Button loading={isRequesting} icon={<CloseCircleOutlined />} onClick={onClickDeleteBtn} />
		</Space>
	);
};

const RoleCell = ({ item, onChange }: any) => {

	const [role, setRole] = useState(item.role);

	return (
		<Select 
			style={{width:'150px'}} 
			value = {role} 
			onChange = {(value)=>{ 
				setRole(value);
				updateAdminRole(item.id, value);
			}}
		>
			<Option value="administrator">Administrator</Option>
			<Option value="editor">Editor</Option>
		</Select>
	);
};


const AllAdmins = ({ match }: any) => {

	const [form] = Form.useForm();

    const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
		},
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'id',
			render:(text:string, record:any) => (
				<RoleCell item = {record} onChange = {()=>loadTable()}/>
			)
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
		history.push(`${match.path}/0`);
	};

	const {pageSize, curPage, total} = tablePaginationOption;

	const onFinishSearch = (e:any) => {
		console.log('-----onFinishSearch----', e.target.value);
		loadTable(e.target.value);
	};

    return (
		<Card title = "Admins">
			{/* <div className={classes.tableHeader}>
				<Button onClick={onCreateNewUser}>New</Button>
			</div> */}
			<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />

			<div style = {{textAlign:'right', marginTop:24}}>
                <Button type = "primary" onClick={onCreateNewUser}>Add New Admin</Button>
            </div>
		</Card>
    );
};

export default AllAdmins;