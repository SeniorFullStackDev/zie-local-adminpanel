import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Form, Input, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getAll, deleteComment } from 'api/api-comments';
import { PlaceType } from 'modules/types';
import CreateReviewForm from './CreateReviewForm';

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

	const [isModalVisible, setModalVisible] = useState(false);

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
		<Card title = "Comments" extra={<Button type="primary" onClick = {addMoreComments}>Add Comment</Button>}>
			<div className="table-header">
				<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
			</div>
			<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />
			<CreateReviewForm isModalVisible = {isModalVisible} onClose = {(updated:boolean)=>{
				if(updated){
					loadTable();
				}
				setModalVisible(false);
			}} />
		</Card>
    );
};

export default AllComments;