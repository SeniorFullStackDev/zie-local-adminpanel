import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as TagAPI from 'api/api-tags';
import { Table, Tag, Space, Button, Modal, Form, Input, Select } from 'antd';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';

import classes from './style.module.scss';
import history from 'modules/history';

const ActionCell = ({ item, onChange, onClickEditButton }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onClickBtn = () => {
		setIsRequesting(true);
		TagAPI.deleteTag(item.ID).then((res) => {
			setIsRequesting(false);
			onChange();
		});
	};
	return (
		<Space size="middle">
			<Button loading={isRequesting} icon={<EditOutlined />} onClick={onClickEditButton}>
				Edit
			</Button>
			<Button loading={isRequesting} icon={<DeleteOutlined />} onClick={onClickBtn}>
				Delete
			</Button>
		</Space>
	);
};

const AllTags = ({ match }: any) => {
	console.log('match --->', match);
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [isRequesting, setIsRequesting] = useState(false);
	const [formAction, setFormAction] = useState('create');
	const [selectedTagId, selecteTagID] = useState(0);

	const loadTable = () => {
		TagAPI.getAllTags().then((res) => {
			console.log('TagAPI ===>', res.body);
			setTableData(res.body);
		});
	};
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const columns = [
		{
			title: 'Type',
			dataIndex: 'tag_type',
			key: 'type',
		},
		{
			title: 'Name',
			dataIndex: 'tag_name',
			key: 'name',
		},
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (text: string, record: any) => (
				<ActionCell
					item={record}
					onChange={() => loadTable()}
					onClickEditButton={() => onClickEditButton(record)}
				/>
			),
		},
	];
	console.log('AllTags --->', 'AllTags');

	useEffect(() => {
		loadTable();
	}, []);

	const onClickEditButton = (item: any) => {
		console.log('onClickEditButton -->', item);
		form.setFieldsValue(item);
		setIsModalVisible(true);
		setFormAction('edit');
	};

	const onCreateNewTag = () => {
		setFormAction('create');
		setIsModalVisible(true);
	};

	const handleOk = () => {
		form
			.validateFields()
			.then((formData) => {
				console.log('formData ----->', formData);
				setIsRequesting(true);
				if (formAction === 'create') {
					TagAPI.createNewTag(formData)
						.then((res) => {
							setIsModalVisible(false);
							setIsRequesting(false);
							loadTable();
						})
						.catch((error) => {
							// setisModalVisible(false);
							setIsRequesting(false);
						});
				} else {
					TagAPI.updateTag(formData)
						.then((res) => {
							setIsModalVisible(false);
							setIsRequesting(false);
							loadTable();
						})
						.catch((error) => {
							// setisModalVisible(false);
							setIsRequesting(false);
						});
				}
			})
			.catch((err) => {
				console.log('ERROR =====>', err);
				setIsRequesting(false);
			});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<div className={classes.tableHeader}>
				<Button onClick={onCreateNewTag}>New</Button>
			</div>
			<Table columns={columns} dataSource={tableData} />
			<Modal
				title={formAction == 'create' ? 'Create New Tag' : 'Edit Tag'}
				visible={isModalVisible}
				onOk={handleOk}
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
						label="Type"
						name="tag_type"
						tooltip={{ title: 'Tag Type', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'Tag Type is required!' }]}
					>
						<Select style={{ width: '100%' }}>
							<Select.Option key="product_type" value="product_type">
								Product Type
							</Select.Option>
							<Select.Option key="product_size" value="product_size">
								Product Size
							</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Name"
						name="tag_name"
						tooltip={{ title: 'Tag Name', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'Tag name is required!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item name="ID" style={{ display: 'none' }}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default AllTags;
