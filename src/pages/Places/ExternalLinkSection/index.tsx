import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import { createExternalLink, updateExternalLink, deleteExternalLink} from 'api/api-place';
import LinkItem from './LinkItem';

interface Props {
    id:string;
    links:any[];
    cityId:any;
    toSave:boolean;
}
const Index = ({id, links, cityId, toSave}:Props) => {

    console.log('hotels ---->', links);

    const [linksArr, setLinksArr] = useState<any[]>(links);

    const onDeleteExternalLink = (index:number) => {
        const item = linksArr[index];
        if(item.id === 0){
            const newArr = [...linksArr];
            newArr.pop();
            setLinksArr(newArr);
        }else{
            // make api call to delete
            deleteExternalLink(item.id).then((res)=>{
                console.log(res.body);
                const newArr = [...linksArr];
                newArr.splice(index, 1);
                setLinksArr(newArr);
            }).catch((error)=>{
                console.log(error.message);
            });
        }
    };

    const onSaveExternalLink = (values:any, index:number) => {
        values.place_id = cityId;
        if(values.id == 0){
            createExternalLink(values).then((res)=>{
                linksArr[index].id = res.body.id;
                setLinksArr([...linksArr]);
            }).catch((err)=>{
                console.log(err);
            });
        }else{
            updateExternalLink(values.id, values).then((res)=>{
                console.log('createGalleryItem ===>', res);
            }).catch((error)=>{
                console.log('ERROR ==>', error.message);
            });
        }
        
    };


    const addMoreItems = () => {
        console.log('addMoreItems');
        const newLinkObj = {
            id:0,
            title:'',
            url:'',
        };
        setLinksArr([...linksArr, newLinkObj]);1;
    };

    if(cityId == 0){
        return <Card id = {id} title = "External Links"><h1>Available after place's basic detail is ready.</h1></Card>;
    }
    
    return (
        <Card id = {id} title = "External Links">
            {
                linksArr.map((item, index)=>
                    <LinkItem 
                        data = {item}
                        key = {index}
                        onDelete = {()=>{onDeleteExternalLink(index);}}
                        onSave = {(values)=>{onSaveExternalLink(values, index);}}
                        toSave = {toSave}
                    />)
            }
            <div style = {{textAlign:'right', marginTop:24}}>
                <Button type = "primary" onClick = {()=>addMoreItems()}>Add More</Button>
            </div>
        </Card>
    );
};

export default Index;