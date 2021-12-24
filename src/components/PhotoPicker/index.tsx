import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor, Alert } from 'antd';
import GalleryDialog from 'components/GalleryDialog';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';


interface Props {
    photo?:any;
    onChangePhoto: (photo:any)=>void;
}

const Index =  ({photo, onChangePhoto}:Props) => {

    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const onChooseImage = () => {
        setVisibleGallery(true);
    };

    const deleteThumbnail = () => {
        onChangePhoto(null);
    };

    const onSelectPhoto = (ele:any) => {
        setVisibleGallery(false);
        onChangePhoto(ele[0]);
    };

    let photoUrl = '';
    if(photo){
        photoUrl = photo.url;
        if(photo.sizes){
            photoUrl = photo.sizes.thumbnail;
        }

    }

    return (
        <div>
                <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}}/>
                {
                    Object.keys(errors).map((key:any, index:number)=>(
                        <Alert
                            message="Error"
                            description={errors[key]}
                            type="error"
                            closable
                            style = {{marginBottom:8}}
                        />
                    ))
                }
                <div className = "imagePreview">
                    {
                        photo ? 
                        <>
                            <img src = {photoUrl} />
                            <div className = 'actionBar'>
                                <span>
                                    <EditFilled onClick = {()=>onChooseImage()} style = {{color:'#fff'}} />
                                </span>
                                <span>
                                    <DeleteFilled style = {{color:'#fff'}} onClick = {deleteThumbnail}/>
                                </span>
                            </div>
                        </>
                        :
                        <Button type = "default" onClick={()=>onChooseImage()}>Add Image</Button>
                    }
                </div>
        </div>
    );
};

export default Index;