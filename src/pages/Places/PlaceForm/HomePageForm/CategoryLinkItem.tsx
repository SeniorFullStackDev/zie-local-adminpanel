import React, { useRef, useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { deleteHomeCategoryLinks } from 'api/api-place';
 
import GalleryDialog from 'components/GalleryDialog';


interface Props {
    data:any;
    onChooseImage:(photo:any)=>void;
    onDeleteImage?:()=>void;
    afterDelete?:(categoryId:number, itemId:number)=>void;
    onChange?:(nData:any)=>void;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
  
const CategoryLinkItem = ({data, onChange, onChooseImage, onDeleteImage, afterDelete}:Props) => {

    const [form] = Form.useForm();

    const [edited, setEdited] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);



    useEffect(()=>{
        form.setFieldsValue(data);
    }, []);

    const deleteImage = () => {
        setReloadCount(reloadCount+1);
        if(onDeleteImage) onDeleteImage();
    };

    const onDelete = () => {
        console.log('-----onDelete------');
        // api call
        setIsRequesting(true);
        if(data.id){
            deleteHomeCategoryLinks(data.id).then((res:any)=>{
                console.log('deleteHomeCategoryLinks ---->', res.body);
                setDeleted(true);
            }).catch((err:any)=>{
                console.log('deleteHomeCategoryLinks ==>', err);
            });
            console.log('onDelete ===>', data);
            // emit event
            if(afterDelete) afterDelete(data.category_id, data.id);
        }
    };

    const renderPreviewField = () => {
        if(data.photo){
            return (
                <>
                    <img src = {data.photo.sizes.thumbnail} />
                    <div className = 'actionBar'>
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

    const onSaveForm = () => {
        const values = form.getFieldsValue();
        values.id = data.id;
        if(data.photo){
            values.photo_id = data.photo[0].id;   
        }
        values.place_id = data.place_id;
        // if(onSave) onSave(values);
    };

    const renderActionButton = () => {
        return (
            <>
                {data.id == 0 && <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                    Create
                </Button>
                }
                <Button type="default" loading = {isRequesting} onClick = {onDelete}>Delete Row</Button>
            </>
        );
    };

    const onChangeForm = () => {
        data = {...data, ...form.getFieldsValue()};
        setEdited(true);
        if(onChange) onChange(data);
    };

    const onSelectPhoto = (photos:any[]) => {
        setVisibleGallery(false);
        onChooseImage(photos[0]);
        
    };

    if(deleted) return null;

    return (
        <div className = 'content'>
           <Form
                {...layout}
                form={form}
                onChange = {onChangeForm}
                >
                <Form.Item
                    label="Title"
                    name="title"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Sub Title"
                    name="sub_title"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Link"
                    name="link"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Preview">
                    <div className = "imagePreview">
                        {renderPreviewField()}
                    </div>
                </Form.Item>

                <Form.Item
                    label="Order Number"
                    name="order_number"
                >
                    <Input type = "number" />
                </Form.Item>


                <Form.Item {...tailLayout}>
                    {renderActionButton()}
                </Form.Item>
            </Form>

            {visibleGalleryDialog && <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}} />}


        </div>
    );
};

export default CategoryLinkItem;