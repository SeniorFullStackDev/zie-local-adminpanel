import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input } from 'antd';
import { getAllCitiesForPhotoAnalystic } from 'api/api-place';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import classes from './style.module.scss';

const AnalysticPhotos = ({ match }: any) => {

	const [form] = Form.useForm();
    const [tableData, setTableData] = useState<any[]>([]);
    const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
            key: 'id',
		},
		{
			title: 'City',
			dataIndex: 'title',
            key: 'title',
		},
		{
			title: 'Link',
			dataIndex: 'title',
            key: 'link',
            render: (text: string, item: any) => <a href={`https://adminpanel-zielonamapa.vercel.app/dashboard/places//${item.id}`}>Link To Laravel</a>,
		},
		{
			title: 'Photos',
			dataIndex: 'photos',
            key: 'photos',
		},
	];

    const loadTable = async ()=>{
		const { body } = await getAllCitiesForPhotoAnalystic();
		setTableData(body);
	};

    useEffect(()=>{
		loadTable();
	}, []);

    return (
		<Table className={classes.tableStripedRows} columns={columns} dataSource={tableData} pagination = {false} />
    );
};

export default AnalysticPhotos;