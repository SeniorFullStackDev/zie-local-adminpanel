import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Space, Button, Modal, Form, Input, Card, Select, notification, Radio } from 'antd';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getAllSeo, getPlaceDetail, saveSEOData, updatePlaceDetail } from 'api/api-place';
import { getAllfakeUsers } from 'api/api-user';
import { getAllCountries, getAllCities } from 'api/api-place';
import history from 'modules/history';
import { PlaceType } from 'modules/types';
import { createNewUser } from 'api/api-user';
import SEOCard from 'components/SEOCard';
import MetadataGenerator from 'utils/metatag-generator';

const ActionCell = ({ item, onChange }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onClickEditBtn = () => {
		// setIsRequesting(true);
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

	const [placeDetail, setPlaceDetail] = useState<any>();

	const seoCardRef = useRef<any>();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const fetchSeoDetail = (item:any) => {
		setPlaceDetail(null);
		getPlaceDetail(item.place.id).then((res)=>{
			if(res.body.place_type == 'country' || res.body.place_type == 'city'){
				console.log('place detail ==>', res.body);
				setPlaceDetail(res.body);
				setModalVisible(true);
			}
		});
		// setPlaceDetail({seo: { schema_json: item.schema_json}, guid: item.place.guid, thumbnail: item.place.thumbnail});
	};

    const columns = [
		{
			title: 'Place',
			dataIndex: 'place.title',
			key: 'place',
			render: (text: string, item: any) => <a onClick = {()=>{
				fetchSeoDetail(item);
			}}>{item.place.title}</a>,
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
	const tablePaginationOptionRef = useRef({total:0, curPage:1, pageSize:10});


	console.log('tableData ===>', tableData);

	

	useEffect(()=>{
		loadTable();
	}, []);

    const loadTable = async (query='')=>{
		const {pageSize, curPage} = tablePaginationOptionRef.current;
		const { body } = await getAllSeo(pageSize * (curPage - 1), pageSize, query);
		tablePaginationOptionRef.current = { curPage, pageSize, total:body.total };
		setTableData(body.data);
	};


	const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		tablePaginationOptionRef.current = {...tablePaginationOptionRef.current, curPage: pagination.current};
		loadTable();
	};

	const {pageSize, curPage, total} = tablePaginationOptionRef.current;

	const onFinishSearch = (e:any) => {
		console.log('-----onFinishSearch----', e.target.value);
		loadTable(e.target.value);
	};

	const onSaveSeo = async () => {

		const tempPlaceId = placeDetail.id;
        let schema_json;

		if(seoCardRef.current){
            const seoData : { schema_json: MetadataGenerator, thumbnail:any } =  seoCardRef.current.getSeoDetail();
            schema_json = seoData.schema_json;
            if(!seoData.thumbnail){
                alert('Please select a photo for place\'s thumbnail');
                return;
            }

            const value = {thumbnail_photo_id: (seoData.thumbnail)?seoData.thumbnail.id:null };

			try {
				const response = await updatePlaceDetail(tempPlaceId, value);
				const seoRes = await saveSEOData(tempPlaceId, { schema_json });
			}catch(error:any){
				console.log(error);
			}
		}
	};

    return (
        <>
			<div className="table-header">
				{/* <Form form={form} style={{ marginTop: 20 }} onFinish={onFinishSearch}> */}
				{/* </Form> */}
				<Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch} onSearch ={loadTable}/>
				{/* <Button onClick={onCreateNewPage}>New</Button> */}
			</div>
			<Table columns={columns} dataSource={tableData} onChange = {onChange}  pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}} />

			<Modal
                centered
                width="90%"
                visible={isModalVisible}
				okText = "Save"
                onOk={()=>{
					onSaveSeo();
				}}
                onCancel = {()=>setModalVisible(false)}
                >
					<SEOCard placeDetail = {placeDetail} ref = {seoCardRef}/>

			</Modal>

        </>
    );
};

export default AllSeos; 