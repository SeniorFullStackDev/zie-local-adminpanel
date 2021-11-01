import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import GalleryDialog from 'components/GalleryDialog';
import { createHotel, updateHotel, deleteHotel } from 'api/api-place';

import Hotelitem from './HotelItem';

interface Props {
    id?:string;
    hotels:any[];
    cityId:any;
    toSave:boolean;
}
const Index = ({id, hotels, cityId, toSave}:Props) => {

    const [hotelArr, setHotelArr] = useState<any[]>(hotels);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [editingHotelIndex, setEditingHotelIndex] = useState<any>();

    const onDeleteHotelItem = (index:number) => {
        console.log('----------onDeleteHotelItem---------');
        console.log('--- onDeleteGalleryItem --- ', index);
        const item = hotelArr[index];
        if(item.id === 0){
            const newArr = [...hotelArr];
            newArr.pop();
            setHotelArr(newArr);
        }else{
            // make api call to delete
            deleteHotel(item.id).then((res)=>{
                console.log(res.body);
                const newArr = [...hotelArr];
                newArr.splice(index, 1);
                setHotelArr(newArr);
            }).catch((error)=>{
                console.log(error.message);
            });
        }
    };

    const onSaveHotelItem = (hotelItemDetail:any, index:number) => {
        hotelItemDetail.city_id = cityId;
        if(hotelItemDetail.id == 0){
            createHotel(hotelItemDetail).then((res)=>{
                hotelArr[index] = hotelItemDetail;
                hotelArr[index].id = res.body.id;
                setHotelArr([...hotelArr]);
            }).catch((err)=>{
                console.log(err);
            });
        }else{
            updateHotel(hotelItemDetail.id, hotelItemDetail).then((res)=>{
                hotelArr[index] = hotelItemDetail;
                setHotelArr([...hotelArr]);
                console.log('createGalleryItem ===>', res);
            }).catch((error)=>{
                console.log('ERROR ==>', error.message);
            });
        }
    };

    const onChooseImage = (hotelItemDetail:any, index:number) => {
        console.log('---------onChooseImage-----------');
        setVisibleGallery(true);
        setEditingHotelIndex(index);

        hotelArr[index] = {...hotelArr[index], ...hotelItemDetail };
        setHotelArr([...hotelArr]);
        setVisibleGallery(true);
    };

    const addMoreItems = () => {
        const newHotelObj = {
            id:0,
            title: '',
            text:'',
            opinions:0,
            rating:0
        };
        setHotelArr([...hotelArr, newHotelObj]);
    };

    const onSelectPhoto = (photos:any[]) => {

        setVisibleGallery(false);

        console.log('onSelectPhoto --->', photos);

        hotelArr[editingHotelIndex].photo =  photos[0];
        hotelArr[editingHotelIndex].photo_id = photos[0].id;
        hotelArr[editingHotelIndex].editing =  true;
        setHotelArr([...hotelArr]);
    };

    const onDeleteHotelImage = (index:number) => {

        hotelArr[index].photo = null;
        setHotelArr([...hotelArr]);
    };

        
    console.log(' hotelArr--->', hotelArr);

    if(cityId == 0){
        return <Card title = "Hotels"><h1>Available after place's basic detail is ready.</h1></Card>;
    }

    return (
        <Card id = {id} title = "Hotels">
            {
                hotelArr.map((item, index)=>
                    <Hotelitem 
                        data = {item}
                        key = {`${item.id}-${index}`}
                        onDelete = {()=>{onDeleteHotelItem(index);}}
                        onSave = {(formData)=>{onSaveHotelItem(formData, index);}}
                        onDeleteImage = {()=>{onDeleteHotelImage(index);}}
                        onChooseImage = {(formData:any)=>{onChooseImage(formData, index);}}
                        toSave = {toSave}
                    />)
            }
            <div style = {{textAlign:'right', marginTop:24}}>
                <Button type = "primary" onClick = {()=>addMoreItems()}>Add More</Button>
            </div>

            <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}} />

        </Card>
    );
};

export default Index;