import React, { useRef, useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Spin } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { scrapeHotelDetailFromBookingCom } from 'api/api-place';

import classes from './style.module.scss';
import { isValidURL } from 'utils';

interface Props {
    data:any;
    onChooseImage:(values:any)=>void;
    onDeleteImage?:()=>void;
    onDelete?:()=>void;
    onSave?:(values:any)=>void;
    toSave:boolean;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
  
const Index = ({data, onChooseImage, onDeleteImage, onDelete, onSave, toSave}:Props) => {

    const [form] = Form.useForm();

    const [hotelDetail, setHotelDetail] = useState(data);

    useEffect(()=>{
        if(toSave && editing){
            onSaveForm();
        }
    }, [toSave]);

    useEffect(()=>{
        setHotelDetail(data);
    }, [data]);

    useEffect(()=>{
        form.setFieldsValue(hotelDetail);
    }, [hotelDetail]);

    const [editing, setEditing] = useState(false);
    const [scrapping, setScrapping] = useState(false);

    const onSaveForm = () => {
        let values = form.getFieldsValue();
        values.id = hotelDetail.id;
        if(hotelDetail.photo){
            values.photo_id = hotelDetail.photo.id;   
        }
        values = {...hotelDetail, ...values};
        
        if(onSave) onSave(values);
    };

    const deleteImage = () => {
        if(onDeleteImage) onDeleteImage();
    };

    const scrapeHotelData = () => {
        const link = form.getFieldValue('link');
        if(!isValidURL(link)){
            alert('invalid url!');
            return;
        }

        setScrapping(true);
        
        scrapeHotelDetailFromBookingCom(link).then((res)=>{
            console.log('scrapeHotelDetailFromBookingCom -->', res.body);
            const { name, description, aggregateRating: {ratingValue, reviewCount}, photo } = res.body;
            const newHotelDetail = {
                ...hotelDetail,
                title: name,
                text:'',
                opinions:reviewCount,
                rating:ratingValue,
                photo,
                photo_id: photo.id
            };
            // form.setFieldsValue(newHotelDetail);
            setHotelDetail(newHotelDetail);
            setEditing(true);
            setScrapping(false);
        }).catch((err)=>console.log);
    };

    const renderActionButton = () => {
        if(hotelDetail.id > 0){
            if(editing || hotelDetail.editing){
                return (
                    <>
                        <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                            Save
                        </Button>
                        <Button type="default" onClick = {onDelete}>Delete Row</Button>
                    </>
                );
            }else{
                return <Button type="default" onClick = {onDelete}>Delete Row</Button>;
            }
        }else{
            return (
                <>
                    <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                        Add & Save
                    </Button>
                    <Button type="default" onClick = {onDelete}>Delete Row</Button>
                </>
            );
        }
    };

    const onChangeForm = () => {
        setEditing(true);
    };

    const renderPreviewField = () => {
        if(hotelDetail.photo){
            if(hotelDetail.photo){
                return (
                    <>
                        <img src = {hotelDetail.photo.sizes.thumbnail} />
                        <div className = {classes.actionBar}>
                            <span>
                                <EditFilled onClick = {()=>onChooseImage(form.getFieldsValue())} style = {{color:'#fff'}} />
                            </span>
                            <span>
                                <DeleteFilled style = {{color:'#fff'}} onClick = {deleteImage}/>
                            </span>
                            
                        </div>
                    </>
                );

            }
        }
        return (
            <Button type = "default" onClick={()=>onChooseImage(form.getFieldsValue())}>Add Image</Button>
        );
    };

    return (
        <div className = {classes.content}>
           <Form
                {...layout}
                form={form}
                onChange = {onChangeForm}
                >
                <Form.Item
                    label="Name"
                    name="title"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Link"
                    name="link"
                >
                    <Input.Search enterButton={<Button className = {classes.btnScrape} loading = {scrapping}>Scrap for update</Button>}  onSearch = {()=>scrapeHotelData()}/>
                </Form.Item>

                <Form.Item label="Preview">
                    <div className = {classes.imagePreview}>
                        {renderPreviewField()}
                    </div>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="text"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Number of reviews"
                    name="opinions"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Rating"
                    name="rating"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    {renderActionButton()}
                </Form.Item>
            </Form>
        </div>
    );
};

export default Index;