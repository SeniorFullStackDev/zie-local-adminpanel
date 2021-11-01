import React, { useRef, useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import classes from './style.module.scss';

interface Props {
    data:any;
    onChooseImage:(values:any)=>void;
    onDeleteImage?:()=>void;
    onDelete?:()=>void;
    onSave?:(values:any)=>void;
    toSave?:boolean;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
  
const GalleryItem = ({data, toSave, onChooseImage, onDeleteImage, onDelete, onSave}:Props) => {

    const [form] = Form.useForm();

    useEffect(()=>{
        form.setFieldsValue(data);
    }, []);

    const [editing, setEditing] = useState(false);

    useEffect(()=>{
        if(toSave && editing){
            onSaveForm();
        }
    }, [toSave]);

    const deleteImage = () => {
        if(onDeleteImage) onDeleteImage();
    };
    const renderPreviewField = () => {
        if(data.photo){
            if(data.photo[0]){
                return (
                    <>
                        <img src = {data.photo[0].sizes.thumbnail} />
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

    const onSaveForm = () => {
        const values = form.getFieldsValue();
        values.id = data.id;
        if(data.photo){
            values.photo_id = data.photo[0].id;   
        }
        values.place_id = data.place_id;
        if(onSave) onSave(values);
    };

    const renderActionButton = () => {
        if(data.id > 0){
            if(editing || data.editing){
                return (
                    <>
                        {/* <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                            Save
                        </Button> */}
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
                        Create
                    </Button>
                    <Button type="default" onClick = {onDelete}>Cancel</Button>
                </>
            );
        }
    };

    const onChangeForm = () => {
        setEditing(true);
    };

    return (
        <div className = {classes.content}>
           <Form
                {...layout}
                form={form}
                onChange = {onChangeForm}
                >
                <Form.Item
                    label="Photo ID"
                    name="photo_id"
                >
                    <Input disabled/>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Alt"
                    name="alt"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Preview">
                    <div className = {classes.imagePreview}>
                        {renderPreviewField()}
                    </div>
                </Form.Item>

                {/* <Form.Item {...tailLayout} name="bad_license" valuePropName="checked">
                    <Checkbox>Bad License</Checkbox>
                </Form.Item> */}

                <Form.Item {...tailLayout}>
                    {renderActionButton()}
                </Form.Item>
            </Form>
        </div>
    );
};

export default GalleryItem;