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
	const onClickBtn = () => {
		setIsRequesting(true);
		deleteComment(item.id).then((res:any)=>{
			setIsRequesting(false);
			onChange();
		}).catch((err:any)=>{
			console.log(err);
		});
	};
	return (
		<Space size="middle">
			<Button loading={isRequesting} icon={<DeleteOutlined />} onClick={onClickBtn}>
				Delete
			</Button>
		</Space>
	);
};


const AllComments = ({ match }: any) => {

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
			title: 'Comment Author',
			dataIndex: 'auth.name',
			key: 'comment_author',
			// render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
			render: (text: string, item: any) => <div>{(item.author)?item.author.name:''}</div>,
		},
		{
			title: 'Author Email',
			dataIndex: 'comment_author_email',
			key: 'comment_author_email',
			render: (text: string, item: any) => <div>{(item.author)?item.author.email:''}</div>,
		},
		{
			title: 'Content',
			dataIndex: 'comment_content',
			key: 'comment_author_IP',
		},
		{
			title: 'Rating',
			dataIndex: 'ratings',
			key: 'ratings',
		},
		{
			title: 'Author IP',
			dataIndex: 'comment_author_IP',
			key: 'comment_author_IP',
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

	const addNewUser = () => {
		console.log('---addNewUser--');
		console.log('new user ==>', authorRef.current);

		const email = authorRef.current;
		const name =  email.split('@')[0];

		setRequesting(true);

		createNewUser({name, email}).then((res:any)=>{
            if(res.body.error){
				console.log('res.body.error ==>', res.body.error);
				Object.keys(res.body.error).every((key:any, index:number)=>{
					console.log('res.body.error[key][0] ==>', res.body.error[key][0]);
					notification.open({
						type:'error',
						message: 'Error',
						description:res.body.error[key][0],
						onClick: () => {
							console.log('Notification Clicked!');
						},
					});
				});
            }else{
				const newuser = {
					name, email, id:res.body.id
				};
				setRequesting(false);
				notification.open({
					type:'success',
					message: 'Message',
					description:'New user is added.',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				});
				setFakeUsers([newuser, ...allFakeUsers]);
            }
            // setRequest(false);
        }).catch((err:any)=>{
            console.log(err);
            // setRequest(false);
        });
	};

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
		<Card title = "Comments" extra={<Button type="primary" onClick = {addMoreComments}>Add Comment</Button>}>
			<div className={classes.tableHeader}>
				{/* <Form form={form} style={{ marginTop: 20 }} onFinish={onFinishSearch}> */}
				{/* </Form> */}
				<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
				{/* <Button onClick={onCreateNewPage}>New</Button> */}
			</div>
			<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />

			<Modal
				title="Add Review"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel = {handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" loading={isRequesting} onClick={handleOk}>
						Ok
					</Button>,
				]}
			>
				<Form form={form} {...layout}>
					<Form.Item
						label="Author"
						name="user_id"
						tooltip={{ title: 'Author', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'Author is required!' }]}
					>
						<Select 
							showSearch 
							style={{ width: '100%' }} 
							notFoundContent = {(<div style = {{display:'flex', justifyContent:'space-between'}}><span>Not Found</span> <Button onClick = {addNewUser}>Add New</Button></div>)}
							filterOption={(input, option:any) => {
								authorRef.current = input.toLocaleLowerCase();
								return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
							}
							}>
							{
								allFakeUsers.map((ele:any, index:number)=>(
									<Select.Option key={ele.id} value={ele.id}>
										{ele.email}
									</Select.Option>
								))
							}
						</Select>
					</Form.Item>

					<Form.Item
						label="Country"
						name="country"
						required
						rules={[{ required: true, message: 'Country is required!' }]}
						tooltip={{ title: 'Country', icon: <InfoCircleOutlined /> }}
					>
						<Select 
							showSearch 
							style={{ width: '100%' }}
							onChange = {(val:any)=>{
								form.setFieldsValue({city:null});
								loadCities(val);
							}}
							filterOption={(input, option:any) => {
								if(option.children){
									return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
								}
								return false;
							}
							}>
							{
								allCountries.map((ele:any, index:number)=>(
									<Select.OptGroup label={ele.title}>
										{
											ele.countries.map((country:any, cIndex:number)=>(
												<Select.Option key={country.id} value={country.id}>
													{country.title}
												</Select.Option>
											))
										}
									</Select.OptGroup>
								))
							}

						</Select>
					</Form.Item>

					<Form.Item
						label="City"
						name="city"
						tooltip={{ title: 'City', icon: <InfoCircleOutlined /> }}
					>
						<Select 
							showSearch 
							style={{ width: '100%' }} 
							filterOption={(input, option:any) => {
								return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
							}
							}>
							{
								allCities.map((city:any, index:number)=>(
									<Select.Option key={city.id} value={city.id}>
										{city.title}
									</Select.Option>
								))
							}
						</Select>
					</Form.Item>

					<Form.Item label="Comments" name="comment_content" required>
						<Input.TextArea showCount style = {{minHeight: 100,}}  rows={8}/>
					</Form.Item>

					<Form.Item label="Rating" name="ratings" required>
						<Radio.Group style={{justifyContent: 'space-between', flexDirection:'row', flex:'1'}} buttonStyle="solid">
							<Space size="small">
								<Radio.Button value="1">1</Radio.Button>
								<Radio.Button value="2">2</Radio.Button>
								<Radio.Button value="3">3</Radio.Button>
								<Radio.Button value="4">4</Radio.Button>
								<Radio.Button value="5">5</Radio.Button>
							</Space>
						</Radio.Group>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
    );
};

export default AllComments;