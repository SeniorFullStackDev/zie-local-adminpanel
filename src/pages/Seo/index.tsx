import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Card, Select, notification, Radio } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getAllSeo } from 'api/api-place';
import { getAllfakeUsers } from 'api/api-user';
import { getAllCountries, getAllCities } from 'api/api-place';
import history from 'modules/history';
import { PlaceType } from 'modules/types';
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

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

    const columns = [
		{
			title: 'Place',
			dataIndex: 'schema_json.title',
			key: 'place',
			render: (text: string, item: any) => <div>{item.schema_json.title}</div>,
		},
		{
			title: 'SEO Title',
			dataIndex: 'schema_json.title',
			key: 'schema_json_title',
			// render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
			render: (text: string, item: any) => <div>{item.schema_json.title}</div>,
		},
		{
			title: 'Meta Description',
			dataIndex: 'schema_json.description',
			key: 'schema_json_description',
			render: (text: string, item: any) => <div>{item.schema_json.description}</div>,
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

	console.log('tableData ===>', tableData);

	

	useEffect(()=>{
		loadTable();
	}, [tablePaginationOption.curPage]);

    const loadTable = async (query='')=>{
		const {pageSize, curPage} = tablePaginationOption;
		const { body } = await getAllSeo(pageSize * (curPage - 1), pageSize, query);
		setTableData(body.data);
		setTablePaginationOption({curPage, pageSize, total:body.total});
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


    return (
        <>
			<div className="table-header">
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