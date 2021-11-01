import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col, Select } from 'antd';
import { Table, Tag, Space, Modal, Form, Input, notification } from 'antd';
import { getComments } from 'api/api-place';
import { getAll, deleteComment, createComment } from 'api/api-comments';
import { getAllfakeUsers } from 'api/api-user';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

interface Prpos {
	id?:string;
    placeId:any;
}

const ActionCell = ({ item, onChange }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);

	const onClickBtn = () => {
		setIsRequesting(true);
        deleteComment(item.id).then((res)=>{
            onChange();
            setIsRequesting(false);
        }).catch(err=>console.log);
	};

	return (
		<Space size="middle">
			<Button loading={isRequesting} icon={<DeleteOutlined />} onClick={onClickBtn}>
				Delete
			</Button>
		</Space>
	);
};

const Index = ({ id, placeId }: Prpos) => {


    const [tableData, setTableData] = useState<any[]>([]);
	const [tablePaginationOption, setTablePaginationOption] = useState<{total:number, curPage:number, pageSize:number}>({total:0, curPage:1, pageSize:10});
	const [isModalVisible, setModalVisible] = useState(false);
	const [isRequesting, setRequesting] = useState(false);
	const [allFakeUsers, setFakeUsers] = useState<any>([]);
	const [form] = Form.useForm();

    const columns = [
		{
			title: 'Comment Author',
			dataIndex: 'auth.name',
			key: 'comment_author',
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
			key: 'comment_content',
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

    const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		console.log('tablePaginationOption --->', tablePaginationOption);
		setTablePaginationOption({...tablePaginationOption, curPage: pagination.current});
	};

    const loadTable = async (query='')=>{
		const {pageSize, curPage} = tablePaginationOption;
		const { body } = await getComments(placeId, pageSize * (curPage - 1), pageSize, query);
		setTableData(body.data);
		setTablePaginationOption({curPage, pageSize, total:body.total});
	};

    useEffect(()=>{
		loadTable();
	}, [tablePaginationOption.curPage, placeId]);

	const loadAllFakeUsers = async () => {
		try {
			const { body } = await getAllfakeUsers();
			setFakeUsers(body);
		}catch(err:any){
			console.log(err);
		}
	};

	const addMoreComments = () => {
		console.log('-------addMoreComments-----------');
		setModalVisible(true);
		//get all users
		loadAllFakeUsers();
	};

	const handleOk = () => {
		console.log('----handleOk----');
		const values = form.getFieldsValue();
		values.place_id = placeId;

		if(values.user_id){
			const authorIndex = allFakeUsers.findIndex((ele:any)=>ele.id == values.user_id);
			values.comment_author_IP = allFakeUsers[authorIndex].user_ip;
		}
		setRequesting(true);
		createComment(values).then((res)=>{
			setRequesting(false);
			setModalVisible(false);
			notification.open({
				message: 'Message',
				description:'New comments is created succesfully.',
				onClick: () => {
					console.log('Notification Clicked!');
				},
			});
			loadTable();
		}).catch((err:any)=>{
			console.log('createComment ===>', err);
			setRequesting(false);
		});
	};

	const handleCancel = () => {
		console.log('-----handleCancel------');
		setModalVisible(false);
	};

    const {pageSize, curPage, total} = tablePaginationOption;

	if(placeId == 0){
        return <Card id = {id} title = "Comments"><h1>Available after place's basic detail is ready.</h1></Card>;
    }
    
    return (
        <Card id = {id} title = "Comments" extra={<Button type="primary" onClick = {addMoreComments}>Add Comment</Button>}>
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
				<Form form={form} labelCol={{span:6}}  wrapperCol = {{span:18}}>
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
							filterOption={(input, option:any) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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

					<Form.Item label="Comments" name="comment_content" required>
						<Input.TextArea showCount style = {{minHeight: 100}} />
					</Form.Item>

					<Form.Item label="Rating" name="ratings" required>
						<Input type="number" max = {5} min = {0} step = {1} />
					</Form.Item>
				</Form>
			</Modal>
        </Card>
    );
};

export default Index;