import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Tabs, Input, Image, Form, Upload, Card, Radio } from 'antd';
import { CheckSquareFilled, MinusSquareFilled, InboxOutlined, FileImageOutlined, CheckCircleFilled} from '@ant-design/icons';
import { getAll, deletePhoto, updatePhotoDetail, deletePhotos } from 'api/api-photo';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import history from 'modules/history';
import { PlaceType } from 'modules/types';
import { UploadForm } from 'components/GalleryDialog/UploadForm';
import PhotoForm from './PhotoForm';

const { TabPane } = Tabs;

const AllPhotos = ({ match }: any) => {

	const selectMode = 'group';
	
	const [photos, setPhotos] = useState<any[]>([]);
	const [paginationOption, setPaginationOption] = useState<{total:number, curPage:number, pageSize:number}>({total:0, curPage:1, pageSize:48});
    const [selectedPhoto, setPhoto] = useState<any[]>([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [form] = Form.useForm();
    const [editingPhoto, setEditingPhoto] = useState<any>();

	useEffect(()=>{
		loadMoreData();
	}, [paginationOption.curPage]);

    const loadMoreData = async (query='')=>{
		const {pageSize, curPage} = paginationOption;
		console.log('curPage --->', paginationOption);
		const { body } = await getAll(pageSize * (curPage - 1), pageSize, query);
		setPhotos([...photos, ...body.data]);
		setPaginationOption({...paginationOption, total:body.total});
	};

    const onChangeTab = (activeKey:any) => {
        console.log(' --- onChangeTab --- ');
        setActiveTab(activeKey);
    };

    const onFinishSearch = () => {
        console.log(' --- onFinishSearch --- ');
    };

    const removePhoto = (ele:any) => {
        console.log('---- removePhoto ---');
        deletePhoto(ele.id).then((res:any)=>{
            const filtered = photos.filter(function(el) { return el.id != ele.id; }); 
            setPhotos(filtered);
        }).catch((err)=>{
            console.log('ERROR ==>', err.messsage);
        });
        
    };

    const handleScroll = (e:any) => {
        const {pageSize, curPage} = paginationOption;
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            console.log('bottom =====>', bottom);
            // loadMoreData();
            setPaginationOption({ ...paginationOption, curPage:curPage + 1});
        }
    };

    const onFinishedUpload = (ele:any[]) => {
        console.log('onFinishedUpload ===>', ele);
        setPhotos([...ele, ...photos]);
        setPhoto(ele);
        setActiveTab('1');
        form.setFieldsValue(ele[0]);
    };

    const onFinishPhotoForm = (values:any) => {
        console.log('onFinishPhotoForm ===>', values);
        // updatePhotoDetail(selectedPhoto.id, values);
    };

    console.log('photos ===>', photos);

    const isSelected = (photo:any) => {
        let flag = false;
        selectedPhoto.forEach(element => {
            if(element.id == photo.id){
                flag = true;
            }
        });
        return flag;
    };

    const addPhoto = (photo:any) => {

        if(selectMode == 'group'){
            let index = -1;
            selectedPhoto.forEach((element, i) => {
                if(element.id == photo.id){
                    index = i;
                }
            });
            if(index > -1){
                selectedPhoto.splice(index, 1);
            }else{
                selectedPhoto.push(photo);
            }
            console.log('selectedPhoto --->', index, selectedPhoto);
            setPhoto([...selectedPhoto]);
        }else{
            setPhoto([photo]);
        }
    };

    const deleteSelectedPhoto = () => {
        console.log('----deleteSelectedPhoto-----');
        setIsRequesting(true);
        const arr:any =  [];
        selectedPhoto.forEach(element => {
            arr.push(element.id);
        });
        deletePhotos(arr).then((res)=>{
            const filtered = photos.filter(function(el) { return arr.indexOf(el.id) === -1;});
            setPhotos(filtered);
            setIsRequesting(false);
        }).catch(err=>{
            setIsRequesting(false);
            console.log(err);
        });
    };

    const cancelSelectedPhoto = () => {
        setPhoto([]);
    };

    return (
		<>
		<Card title="Photos" extra = {( selectedPhoto.length > 0 && <><Button type="default" loading = {isRequesting} onClick = {cancelSelectedPhoto}>Cancel</Button> <Button type="primary" danger loading = {isRequesting} onClick = {deleteSelectedPhoto}>Delete</Button></>)}>
			<div style = {{minHeight:'70vh', position:'relative'}}>
                <Tabs onChange={onChangeTab} type="card" activeKey = {activeTab}>
                    <TabPane tab="Media Libray" key="1">
                        <Row>
                            <Col span = {(selectMode !== 'group')?20:24} >
                                <div>
                                    <Input.Search style={{ width: '400px' }} onPressEnter = {onFinishSearch}/>
                                </div>
                                <div style = {{height: 'calc(70vh - 100px)', marginTop:'8px', overflowY:'auto', overflowX:'hidden'}} onScroll ={handleScroll}>
                                    <Row gutter = {[8, 8]}>
                                        {photos.map((ele, i)=>(
                                            <Col md = {4} sm = {6} lg = {3} style = {{overflow:'hidden'}}>
                                                <div style = {{position:'relative'}}>
                                                    <img style = {{width:'100%'}} src = {ele.sizes['thumbnail']} onClick = {()=>{
                                                        setEditingPhoto(ele);
                                                    }}/>
                                                    <div className = "photos-checkbox-group">
                                                        <span className = 'checkbox' onClick = {()=>{
                                                            addPhoto(ele);
                                                            form.setFieldsValue(ele);
                                                        }}>
                                                            {isSelected(ele) && <CheckCircleFilled />}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Upload files" key="2">
                        <UploadForm onFinishedUpload = {onFinishedUpload}/>
                    </TabPane>
                </Tabs>
            </div>
		</Card>
        <PhotoForm photo = {editingPhoto} onClose = {(values?:any)=>{
            if(values){
                const index = photos.findIndex((ele)=>ele.id == editingPhoto.id);
                photos[index] = { ...editingPhoto, ...values};
                setPhotos([...photos]);
            }
            setEditingPhoto(null);
        }}
        onDelete = {()=>{
            const index = photos.findIndex((ele)=>ele.id == editingPhoto.id);
            photos.splice(index, 1);
            setPhotos([...photos]);
            setEditingPhoto(null);
        }}
        />
		</>
    );
};

export default AllPhotos;