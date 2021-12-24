import React, { useEffect, useState } from 'react';
import { Space, Modal, Form, Row, Col, Input, Button, notification } from 'antd';
import { deletePhoto, updatePhotoDetail } from 'api/api-photo';

interface Props {
    photo:any;
    onClose: (values?:any)=>void;
    onDelete:()=>void;
}

const Index = ({photo, onClose, onDelete}:Props) => {

    const [form]= Form.useForm();

    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(()=>{
        form.setFieldsValue(photo);
    }, [photo]);

    const onClickSaveButton = async () => {
        setIsRequesting(true);
        const values = form.getFieldsValue();
        try{
            await updatePhotoDetail(photo.id, values);
        }catch(error){
            console.log(error);
        }
        setIsRequesting(false);
        onClose(values);
    };

    const onClickDeleteButton =  async () => {
        console.log('----oclicked delte button');
        setIsRequesting(true);
        try{
            await deletePhoto(photo.id);
        }catch(error){
            console.log(error);
        }
        setIsRequesting(false);
        onDelete();
    };

    return (
        <Modal
                title="Image detail"
                centered
                width="90%"
                visible={photo}
                footer = {null}
                onCancel = {()=>onClose()}
                // onOk={()=>{
                //     // onSelect(selectedPhoto);
                //     onClose();
                // }}
                // onCancel = {()=>{
                //     onClose();
                // }}
                >
                    <Form form = {form} style = {{paddingLeft:16, paddingRight:16}}>
                        <Row gutter = {[32, 8]}>
                            <Col span = {8}>
                                <img src = {(photo)?photo.url:''} width = "100%" />
                            </Col>
                            <Col span = {16}>
                                Alt:
                                <Form.Item name = "alt">
                                    <Input />
                                </Form.Item>
                                Description:
                                <Form.Item name = "description">
                                    <Input />
                                </Form.Item>
                                Url:
                                <Form.Item name = "url">
                                    {/* <Input.Search enterButton = "Copy"/> */}
                                    <Input disabled suffix = {<Button type = "primary" onClick = {()=>{
                                        navigator.clipboard.writeText(form.getFieldValue('url'));
                                        console.log('copy of url');
                                        notification.open({
                                            type:'info',
                                            message: '',
                                            description:'Copied!',
                                            onClick: () => {
                                                console.log('Notification Clicked!');
                                            },
                                        });
                                    }}>Copy</Button>} style = {{paddingTop:0, paddingRight:0, paddingBottom:0}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <br/>
                        <Space style = {{display:'flex', justifyContent:'space-between'}}>
                            <Button type="primary" danger onClick = {onClickDeleteButton} loading = {isRequesting}>Delete</Button>
                            <div>
                                <Button type="default" onClick = {onClose}>Cancel</Button>
                                <Button type="primary" style = {{marginLeft:16}} onClick = {onClickSaveButton} loading = {isRequesting}>Save</Button>
                            </div>
                        </Space>
                    </Form>
        </Modal>
    );
};

export default Index;