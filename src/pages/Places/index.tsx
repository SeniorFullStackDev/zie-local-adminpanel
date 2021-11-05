import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Grid } from 'antd';
import { getAll, deletePlace } from 'api/api-place';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import history from 'modules/history';
import { PlaceType } from 'modules/types';
 

const confirm = Modal.confirm;
const ActionCell = ({ item, onChange }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onClickBtn = () => {
		confirm({
            title: 'Are you sure you want to delete this place?',
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
				deletePlace(item.id);
				onChange();
            },
            onCancel() {
              console.log('Cancel');
            },
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


const AllPlaces = ({ match }: any) => {

	const [form] = Form.useForm();

    const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'consultant_name',
			render: (text: string, item: any) => <Link to={`${match.path}/${item.id}`}>{text}</Link>,
		},
		{
			title: 'Search Label',
			dataIndex: 'search_label',
			key: 'search_label',
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

	const onCreateNewCountry = () => {
		history.push(`${match.path}/country/new`);
	};

	const onCreateNewCity = () => {
		history.push(`${match.path}/city/new`);
	};

	const {pageSize, curPage, total} = tablePaginationOption;

	const onFinishSearch = (e:any) => {
		console.log('-----onFinishSearch----', e.target.value);
		loadTable(e.target.value);
	};

    return (
		<>
        <div className="table-header">
			{/* <Form form={form} style={{ marginTop: 20 }} onFinish={onFinishSearch}> */}
			{/* </Form> */}
			<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
			<div>
				<Button onClick={onCreateNewCountry}>Add New Country</Button>
				<Button onClick={onCreateNewCity} style = {{marginLeft:16}} type="primary">Add New City</Button>
			</div>
		</div>
		<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />
		</>
    );
};

export default AllPlaces;