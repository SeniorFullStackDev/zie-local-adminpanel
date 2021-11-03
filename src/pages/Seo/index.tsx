import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Card, Select, notification, Radio } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getAll, deleteComment, createComment } from 'api/api-comments';
import { getAllfakeUsers } from 'api/api-user';
import { getAllCountries, getAllCities } from 'api/api-place';
import history from 'modules/history';
import { PlaceType } from 'modules/types';
import classes from './style.module.scss';
import { createNewUser } from 'api/api-user';

const ActionCell = ({ item, onChange }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onClickEditBtn = () => {
		setIsRequesting(true);
		// deleteComment(item.id).then((res:any)=>{
		// 	setIsRequesting(false);
		// 	onChange();
		// }).catch((err:any)=>{
		// 	console.log(err);
		// });
	};
	return (
		<Space size="middle">
            <Button loading={isRequesting} icon={<EditOutlined />} onClick={onClickEditBtn} />
		</Space>
	);
};


const AllSeos = ({ match }: any) => {

	const [form] = Form.useForm();

	const [isModalVisible, setModalVisible] = useState(false);
	const [isRequesting, setRequesting] = useState(false);
	const [allFakeUsers, setFakeUsers] = useState<any>([]);
	const [allCountries, setAllCountries] = useState<any>([]);
	const [allCities, setAllCities] = useState<any>([]);
	const authorRef = React.useRef<any>();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

    const columns = [
		{
			title: 'Place',
			dataIndex: 'place.title',
			key: 'place',
			render: (text: string, item: any) => <div>{(item.place)?item.place.title:''}</div>,
		},
		{
			title: 'SEO Title',
			dataIndex: 'auth.name',
			key: 'comment_author',
			// render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
			render: (text: string, item: any) => <div>{(item.author)?item.author.name:''}</div>,
		},
		{
			title: 'Meta Description',
			dataIndex: 'comment_author_email',
			key: 'comment_author_email',
			render: (text: string, item: any) => <div>{(item.author)?item.author.email:''}</div>,
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
		loadAllFakeUsers();
		loadAllCountries();
	},[]);

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

	const loadAllFakeUsers = async () => {
		try {
			const { body } = await getAllfakeUsers();
			setFakeUsers(body);
		}catch(err:any){
			console.log(err);
		}
	};

	const loadAllCountries = async () => {
		try {
			const { body } = await getAllCountries();
			setAllCountries(body);
		}catch(err:any){
			console.log(err);
		}
	};

	const loadCities = async (countryId:any) => {
		try {
			const { body } = await getAllCities(countryId);
			setAllCities([{}, ...body]);
		}catch(err:any){
			console.log(err);
		}
	};

	const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		console.log('tablePaginationOption --->', tablePaginationOption);
		setTablePaginationOption({...tablePaginationOption, curPage: pagination.current});
	};

	const onCreateNewPage = () => {
		history.push(`${match.path}/0`);
	};

	const {pageSize, curPage, total} = tablePaginationOption;

	const onFinishSearch = (e:any) => {
		console.log('-----onFinishSearch----', e.target.value);
		loadTable(e.target.value);
	};

	const addMoreComments = () => {
		console.log('-----addMoreComments----');
		setModalVisible(true);
	};

	const handleOk = () => {
		const values = form.getFieldsValue();
		values.place_id = values.country;
		if(values.city) values.place_id = values.city;
		if(values.user_id){
			const authorIndex = allFakeUsers.findIndex((ele:any)=>ele.id == values.user_id);
			values.comment_author_IP = allFakeUsers[authorIndex].user_ip;
		}
		setRequesting(true);
		createComment(values).then((res)=>{
			setRequesting(false);
			// setModalVisible(false);
			notification.open({
				type:'success',
				message: 'Message',
				description:'New comments is created succesfully.',
				onClick: () => {
					console.log('Notification Clicked!');
				},
			});
			form.resetFields();
			loadTable();
		}).catch((err:any)=>{
			console.log('createComment ===>', err);
			setRequesting(false);
		});
	};
	const handleCancel = () => {
		setModalVisible(false);
	};

    return (
        <>
			<div className={classes.tableHeader}>
				{/* <Form form={form} style={{ marginTop: 20 }} onFinish={onFinishSearch}> */}
				{/* </Form> */}
				<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
				{/* <Button onClick={onCreateNewPage}>New</Button> */}
			</div>
			<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />
        </>
    );
};

export default AllSeos;