import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Tabs, Input, Image, Form, Upload } from 'antd';
import { CheckSquareFilled, MinusSquareFilled, InboxOutlined, FileImageOutlined} from '@ant-design/icons';
import { getAll, deletePhoto, updatePhotoDetail } from 'api/api-photo';
import config from 'api/config';
 
import { UploadForm } from './UploadForm';
import useGallery from 'modules/gallery/gallery.hook';

const { TabPane } = Tabs;

interface Props {
    open:boolean;
    onClose:()=>void;
    onSelect:(photos:any[])=>void;
    selectMode?:string;
}
const GalleryDialog = ({open, onSelect, onClose, selectMode = 'single' }:Props) => {

    const { gallery : { photos }, setPhotos} = useGallery();
    const [selectedPhoto, setPhoto] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('1');
    const [form] = Form.useForm();
    const loadingRef = React.useRef(false);

	useEffect(()=>{
        if(photos.length == 0){
            loadMoreData();
        }
	}, []);

    const loadMoreData = async (query='')=>{
        if(!loadingRef.current){
            loadingRef.current = true;
            const { body } = await getAll(photos.length, 48, query);
            setPhotos([...photos, ...body.data]);
            loadingRef.current = false;
        }
	};

    console.log('gallery dialog is loading...');

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
            const filtered = photos.filter(function(el:any) { return el.id != ele.id; }); 
            setPhotos(filtered);
        }).catch((err)=>{
            console.log('ERROR ==>', err.messsage);
        });
        
    };

    const handleScroll = (e:any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            loadMoreData();
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

    return (
        <>
            <Modal
                title="Select Image"
                centered
                width="90%"
                visible={open}
                onOk={()=>{onSelect(selectedPhoto);}}
                onCancel = {onClose}
                >
                    <div style={{minHeight:'70vh', position:'relative'}}>
                        <Tabs onChange={onChangeTab} type="card" activeKey = {activeTab}>
                            <TabPane tab="Media Libray" key="1">
                                <Row>
                                    <Col span = {(selectMode !== 'group')?20:24} >
                                        <div>
                                            <Input.Search style={{ width: '400px' }} onPressEnter = {onFinishSearch}/>
                                        </div>
                                        <div className = "gallery-image-wrapper" onScroll ={handleScroll}>
                                            <Row gutter = {[4, 4]}>
                                                {photos.map((ele:any)=>(
                                                    <Col md = {4} sm = {6} lg = {3}>
                                                        <div className = {`photo-item ${(isSelected(ele))?'active':''}` }>
                                                            <img src = {ele.sizes['thumbnail']} onClick = {()=>{
                                                                addPhoto(ele);
                                                                form.setFieldsValue(ele);
                                                            }}/>
                                                            <div className = "checkMark">
                                                                <div className = "checked">
                                                                    <CheckSquareFilled/>
                                                                </div>
                                                                <div className = 'remove'>
                                                                    <MinusSquareFilled onClick = {()=>{removePhoto(ele);}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                            
                                        </div>
                                    </Col>
                                    {selectMode !== 'group' && <Col span = {4}>
                                        <div style = {{padding:8}}>
                                            <div>ATTACHMENT DETAIL</div>
                                            <div className = 'content'>
                                                {selectedPhoto[0] && <Image src = {selectedPhoto[0].url}/>}
                                            </div>
                                            <div>
                                                <Form form = {form} labelCol = {{span:24}} wrapperCol = {{span:24}} onFinish = {onFinishPhotoForm}>
                                                    <Form.Item label="Alt:" name = "alt">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item label="Description:" name = "description">
                                                        <Input.TextArea />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button style = {{marginRight:0, marginLeft:'auto'}} type = "primary" htmlType = "submit">Save</Button>
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        </div>
                                    </Col>}
                                </Row>
                            </TabPane>
                            <TabPane tab="Upload files" key="2">
                                <UploadForm onFinishedUpload = {onFinishedUpload}/>
                            </TabPane>
                        </Tabs>
                    </div>
            </Modal>
        </>
    );
};

export default GalleryDialog;