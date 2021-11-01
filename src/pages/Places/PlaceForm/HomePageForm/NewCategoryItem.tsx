import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Button, Tabs, Radio, Row, Col, Anchor, Modal, Form, Select, Input } from 'antd';
import { createHomeCategoryLinks } from 'api/api-place';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import classes from './style.module.scss';
import GalleryDialog from 'components/GalleryDialog';


export default ({categoryLinks, onAddedNewItem}:any) => {

    const [visibleNewModal, setVisibleNewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [photo, setPhoto] = useState<any>();
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);


    const handleOk = () => {
        const data = form.getFieldsValue();
        data.order_number = data.order_number || 1;
        if(photo.id){
            data.photo_id = photo.id;
        }
        setLoading(true);
        createHomeCategoryLinks(data).then((res:any)=>{
            setLoading(false);
            setVisibleNewModal(false);
            onAddedNewItem({...res.body, photo});
        }).catch((error:any)=>{
            console.log('error ==>', error);
        });
    };

    const onSelectPhoto = (photos:any[]) => {
        setVisibleGallery(false);
        setPhoto(photos[0]);
    };


    const deleteImage = () => {
        console.log('deleteImage --->');
    };

    const handleCancel = () => {
        console.log('----handleCancel----');
        setVisibleNewModal(false);
    };

    const addMoreItem = () => {
        form.setFieldsValue({
            category_id:'',
            title:'',
            sub_title:'',
            order_number: 1,
            sub_page_id: '',
        });
        setPhoto(null);
        setVisibleNewModal(true);
    };

    const renderPreviewField = () => {
        if(photo){
            return (
                <>
                    <img src = {photo.sizes.thumbnail} />
                    <div className = {classes.actionBar}>
                        <span>
                            <EditFilled onClick = {()=>{
                                setVisibleGallery(true);
                                }} style = {{color:'#fff'}} />
                        </span>
                        <span>
                            <DeleteFilled style = {{color:'#fff'}} onClick = {deleteImage}/>
                        </span>
                        
                    </div>
                </>
            );
        }
        return (
            <Button type = "default" onClick={()=>{
                setVisibleGallery(true);
            }
            }>Add Image</Button>
        );
    };


    return (
        <div>
            <div style = {{textAlign:'right'}}><Button type = "default" onClick = {addMoreItem}>Add More</Button></div>

            <Modal
				title="Add More"
				visible={visibleNewModal}
				onOk={handleOk}
				onCancel = {handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="submit" type="primary" loading={loading} onClick={handleOk}>
						Ok
					</Button>,
				]}
			>
				<Form form={form} labelCol= {{ span: 6 }}  wrapperCol = {{ span: 18 }} >
					<Form.Item
						label="Category"
						name="category_id"
						required
						rules={[{ required: true, message: 'Category is required!' }]}
					>
						<Select 
							showSearch 
							style={{ width: '100%' }} 
							filterOption={(input, option:any) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}>
							{
								categoryLinks.map((ele:any, index:number)=>(
									<Select.Option key={ele.id} value={ele.id}>
										{ele.category_name}
									</Select.Option>
								))
							}
						</Select>
					</Form.Item>

                    <Form.Item
						label="Continent"
						name="sub_page_id"
						rules={[{ required: true, message: 'Choose a continent.' }]}
					>
						<Select 
							showSearch 
							style={{ width: '100%' }} 
                            >
							<Select.Option value={5}>
								Europe
							</Select.Option>
                            <Select.Option value={11}>
								South America
							</Select.Option>
						</Select>
					</Form.Item>

                    <Form.Item label="Preview">
                        <div className = {classes.imagePreview}>
                            {renderPreviewField()}
                        </div>
                    </Form.Item>

                    <Form.Item label = "Title" name="title" required rules={[{ required: true, message: 'title is required!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label = "Sub Title" name="sub_title" required rules={[{ required: true, message: 'Sub title is required!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label = "Link" name="link" required rules={[{ required: true, message: 'Link is required!' }]} tooltip={{ title: 'Copy from place\'s link', icon: <InfoCircleOutlined /> }}>
                        <Input />
                    </Form.Item>

                    <Form.Item label = "Order Number" name="order_number">
                        <Input type = "number" />
                    </Form.Item>

				</Form>
			</Modal>

            {visibleGalleryDialog && <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}} />}
        </div>
    );
};