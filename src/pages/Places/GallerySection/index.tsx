import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import GalleryDialog from 'components/GalleryDialog';
import GalleryItem from './GalleryItem';
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from 'api/api-place';

interface Props {
    id?:string;
    gallery:any[];
    placeId:any;
    placeDetail:any;
    toSave:boolean;
}
const Gallery = ({id, gallery, placeId, placeDetail, toSave}:Props) => {
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [editingPhotoIndex, setEditingPhotoIndex] = useState<any>();
    const [galleryData, setGalleryData] = useState<any[]>(gallery);
    const [selectMode, setSelectMode] = useState('single');

    useEffect(()=>{
        console.log('gallery ===>', gallery);
        if(gallery){
            setGalleryData(gallery);
        }
    }, [gallery]);

    const onSelectPhoto = (photos:any[]) => {
        
        if(selectMode == 'group'){
            console.log('photos ==>', photos);
            const createGalleryItems = async () => {
                const newArr:any[] = [];
                for(let i = 0; i < photos.length; i++){
                    const photo = photos[i];
                    const param:any = {
                        id:0,
                        photo_id:photo.id,
                        alt:placeDetail.title,
                        place_id:placeId,
                        bad_license:0,
                        description: `${placeDetail.title} ${(placeDetail.parent)?`, ${placeDetail.parent.title}`:''} - @Zielonamapa.pl`,
                        photo:[]
                    };
                    try{
                        const res = await createGalleryItem(param);
                        param.id = res.body.id;
                        param.photo = [photo];
                        newArr.push(param);
                    }catch(error:any){
                        console.log('eror -->', error.message);
                    }
                }
                setGalleryData([...newArr, ...galleryData]);
                setVisibleGallery(false);
            };

            createGalleryItems();

        }else{
            setVisibleGallery(false);
            galleryData[editingPhotoIndex].photo =  photos;
            galleryData[editingPhotoIndex].photo_id = photos[0].id;
            galleryData[editingPhotoIndex].editing =  true;
            setGalleryData([...galleryData]);

        }
    };

    const onSelectGalleryItem = (formData:any, index:number) => {
        setEditingPhotoIndex(index);
        galleryData[index] = {...galleryData[index], ...formData };
        setGalleryData([...galleryData]);
        setVisibleGallery(true);
        setSelectMode('single');
    };

    const onDeleteItem = (index:number) => {
        console.log('onDeleteItem ===> ', index);
        galleryData[index].photo = null;
        setGalleryData([...galleryData]);
    };

    const addMoreItem = ()=> {
        console.log('---- addMoreItem ---- ');
        // const newPhotoObj = {
        //     id:0,
        //     photo_id:'',
        //     alt:'',
        //     place_id:placeId,
        //     bad_license:0,
        //     description:'',
        //     photo:null
        // };
        // setGalleryData([newPhotoObj, ...galleryData]);
        setVisibleGallery(true);
        setSelectMode('group');
    };

    const onDeleteGalleryItem = (index:number) => {
        console.log('--- onDeleteGalleryItem --- ', index);
        const item = galleryData[index];
        if(item.id === 0){
            const newArr = [...galleryData];
            newArr.shift();
            setGalleryData(newArr);
        }else{
            // make api call to delete
            deleteGalleryItem(item.id).then((res)=>{
                console.log(res.body);
                const newArr = [...galleryData];
                newArr.splice(index, 1);
                setGalleryData(newArr);
            }).catch((error)=>{
                console.log(error.message);
            });
        }
    };

    const onSaveGalleryItem = (values:any, index:number) => {
        console.log('onSaveGalleryItem ===>', values, index);
        if(values.id == 0){
            createGalleryItem(values).then((res)=>{
                console.log('createGalleryItem ===>', res);
                galleryData[index].id = res.body.id;
                setGalleryData([...galleryData]);
            }).catch((error)=>{
                console.log('ERROR ==>', error.message);
            });
        }else{
            updateGalleryItem(values.id, values).then((res)=>{
                console.log('createGalleryItem ===>', res);
            }).catch((error)=>{
                console.log('ERROR ==>', error.message);
            });
        }
    };

    if(placeId == 0){
        return <Card id = {id} title = "Gallery"><h1>Available after place's basic detail is ready.</h1></Card>;
    }

    return (
        <div id = {id}>
            <Card title = "Gallery" extra={<Button type="primary" onClick = {()=>addMoreItem()}>Upload more</Button>}>
                {galleryData.map((ele, i)=>
                    <GalleryItem key = {i} data = {ele} onDeleteImage = {()=>{onDeleteItem(i);}} onChooseImage = {(formData:any)=>{onSelectGalleryItem(formData, i);}} onDelete = {()=>{onDeleteGalleryItem(i);}} onSave = {(values)=>onSaveGalleryItem(values, i)} toSave = {toSave} />
                )}
            </Card>
            <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}} selectMode = {selectMode} />
        </div>
    );
};

export default Gallery;