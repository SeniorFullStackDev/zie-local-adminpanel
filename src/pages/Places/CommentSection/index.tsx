import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col, Select } from 'antd';
import { Table, Tag, Space, Modal, Form, Input, notification } from 'antd';
import { getComments } from 'api/api-place';
import { getAll, deleteComment, createComment } from 'api/api-comments';
import { getAllfakeUsers } from 'api/api-user';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateReviewForm from 'pages/Comments/CreateReviewForm';

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

	const addMoreComments = () => {
		console.log('-------addMoreComments-----------');
		setModalVisible(true);
	};

    const {pageSize, curPage, total} = tablePaginationOption;

	if(placeId == 0){
        return <Card id = {id} title = "Comments"><h1>Available after place's basic detail is ready.</h1></Card>;
    }
    
    return (
        <Card id = {id} title = "Comments" extra={<Button type="primary" onClick = {addMoreComments}>Add Comment</Button>}>
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

export default Index;