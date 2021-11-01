import React, { useState, useEffect } from 'react';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import * as ProductAPI from 'api/api-products';
import { Table, Tag, Space, Button, Modal, Form, Input } from 'antd';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';
import classes from './style.module.scss';
import history from 'modules/history';

const ActionCell = ({ item, onChange }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onClickBtn = () => {
		setIsRequesting(true);
		ProductAPI.deleteProduct(item.ID).then((res) => {
			setIsRequesting(false);
			onChange();
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

const ProductManagement = ({ match }: any) => {
	console.log('match --->', match);
	const [tableData, setTableData] = useState([]);
	const loadTable = () => {
		ProductAPI.getAll().then((res) => {
			console.log('ProductAPI ===>', res.body);
			setTableData(res.body);
		});
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '15%',
			render: (text: string, item: any) => <Link to={`${match.path}/${item.ID}`}>{text}</Link>,
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			width: '15%',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Base Price',
			dataIndex: 'base_price',
			width: '7%',
			key: 'base_price',
			render: (text: string) => {
				let price = '0.00';
				if (parseFloat(text)) {
					price = formatPrice(parseFloat(text));
				}
				return <div className={classes.leftAlign}>{price}</div>;
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: '7%',
			key: 'status',
		},
		// {
		// 	title: 'Age',
		// 	dataIndex: 'age',
		// 	key: 'age',
		// },
		// {
		// 	title: 'Address',
		// 	dataIndex: 'address',
		// 	key: 'address',
		// },
		// {
		// 	title: 'Tags',
		// 	key: 'tags',
		// 	width: '30%',
		// 	dataIndex: 'tags',
		// 	render: (tags: any[]) => (
		// 		<>
		// 			{tags.map((tag, i) => {
		// 				let color = tag.length > 5 ? 'geekblue' : 'green';
		// 				if (tag === 'loser') {
		// 					color = 'volcano';
		// 				}
		// 				return (
		// 					<Tag color={color} key={`${tag}-${i}`}>
		// 						{tag.toUpperCase()}
		// 					</Tag>
		// 				);
		// 			})}
		// 		</>
		// 	),
		// },
		{
			title: 'Action',
			key: 'action',
			width: '20%',
			render: (text: string, record: any) => (
				<ActionCell item={record} onChange={() => loadTable()} />
			),
		},
	];
	console.log('ProductManagement --->', 'ProductManagement');

	useEffect(() => {
		loadTable();
	}, []);

	const onCreateNewProduct = () => {
		history.push(`${match.path}/create`);
	};

	const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		console.log('pagination --->', pagination);
		console.log('pagination --->', filters);
		console.log('pagination --->', extra);
	};

	return (
		<>
			<div className={classes.tableHeader}>
				<Button onClick={onCreateNewProduct}>New</Button>
			</div>
			<Table columns={columns} dataSource={tableData} onChange={onChange} />
		</>
	);
};

export default ProductManagement;
