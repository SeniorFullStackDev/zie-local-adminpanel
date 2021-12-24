import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { createCityContent, deleteCategoryPage, updateCityContent, deleteCityContent, updatePlaceDetail, createCategoryPage} from 'api/api-place';
import { DeleteFilled, EditFilled, CloseOutlined } from '@ant-design/icons';
import HTMLEditor from 'components/HTMLEditor';
import GalleryDialog from 'components/GalleryDialog';

 
import { generateUrlFromTitle } from 'utils';

const { Option } = Select;

interface Props {
    data:any,
    countryId:any,
    contentKey:any,
    parentPlace:any,
    cities:any[],
    categoryPageId:number;
    toSave?:boolean;
    visibleActionButton?:boolean;
}

const index = ({contentKey, parentPlace, categoryPageId, countryId, data, cities, toSave, visibleActionButton}:Props) => {

    const editorRef = useRef<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [childrenPlaces, setChildrenPlaces] = useState<any[]>(data.child_places);
    const [saving, setSaving] = useState(false);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [thumbnail, setThumbnail] = useState<any>();
    const [edited, setEdited] = useState(false);
0;
    const [form] = Form.useForm();

    useEffect(()=>{
        if(data.category_page){
            if(data.category_page.guid){
                const guid = data.category_page.guid;
                const parent_guid = parentPlace.guid;
                setFormData({...data.category_page, guid:guid.includes(parent_guid)?guid:`${parent_guid}${guid}`});
                setThumbnail(data.category_page.thumbnail);
            }
        }
        // setChildrenPlaces(data.child_places);
    }, []);

    useEffect(()=>{
        if(toSave && edited){
            form.submit();
        }
    }, [toSave]);

    useEffect(()=>{
        form.setFieldsValue(formData);
    }, [formData]);

    const onFinish = (values:any) => {
        
        if (editorRef.current) {
            values.content = editorRef.current.getContent();
        }

        if(!thumbnail){
            alert('Select a Thumbnail!');
        }

        const params = {
            ...formData,
            ...values,
            category_page_id:categoryPageId,
            thumbnail_photo_id: thumbnail.id,
            place_parent_id: countryId,
            category_id: data.category.id,
            child_places: childrenPlaces.map((ele)=>{delete ele.id; return ele;})
        };

        console.log('params ===>', params);

        const pageId = formData.id;
        setSaving(true);

        if(pageId){
            // update
            updatePlaceDetail(pageId, params).then((res)=>{
                setSaving(false);
            }).catch((error)=>{
                console.log('error ==>',error);
            });
        }else{
            // create
            createCategoryPage(params).then((res)=>{
                setFormData(res.body);
                setSaving(false);
                setEdited(false);
            }).catch(err=>console.log);
        }
    };

    const clearContent = () => {

        setFormData({});
        setThumbnail(null);
        setChildrenPlaces([]);

        const id = formData.id;
        if(id){
            //delete
            deleteCategoryPage(id).then((res)=>{
                console.log(res.body);
            }).catch(err=>console.log);
        }
    };

    const addContent = () => {
        setFormData({id:0, title:'', content:'', guid:''});
    };

    const deleteThumbnail = () => {
        setThumbnail(null);
    };

    const onChooseImage = () => {
        setVisibleGallery(true);
    };

    const onSelectPhoto = (ele:any) => {
        setVisibleGallery(false);
        setThumbnail(ele[0]);
        setEdited(true);
    };

    const addMoreChildPlace = () => {
        const newCity = {
            sub_place_id:'',
            category_page_id:categoryPageId,
        };
        setChildrenPlaces([...childrenPlaces, newCity]);
    };

    const onChangeChildPlace = (val:any, index:number) => {
        childrenPlaces[index].sub_place_id = val;
        setChildrenPlaces([...childrenPlaces]);
        setEdited(true);
    };

    const removeCity = (index:number) => {
        childrenPlaces.splice(index, 1);
        setChildrenPlaces([...childrenPlaces]);
    };

    const renderPreviewField = (photo:any) => {
        if(photo){
            if(photo){
                return (
                    <>
                        <img src = {photo.url} />
                        <div className = 'actionBar'>
                            <span>
                                <EditFilled onClick = {()=>onChooseImage()} style = {{color:'#fff'}} />
                            </span>
                            <span>
                                <DeleteFilled style = {{color:'#fff'}} onClick = {deleteThumbnail}/>
                            </span>
                        </div>
                    </>
                );

            }
        }
        return (
            <Button type = "default" onClick={()=>onChooseImage()}>Add Image</Button>
        );
    };

    // let difference = arr1.filter(x => !arr2.includes(x));

    console.log('cities ===>', cities);

    function comparer(otherArray:any[]){
        return function(current:any){
          return otherArray.filter(function(other){
            return other.sub_place_id == current.id;
          }).length == 0;
        };
      }


    if(countryId == 0){
        return <Card title = {data.label}><h1>Available after place's basic detail is ready.</h1></Card>;
    }

      
    // const unSelectedCities = cities.filter(comparer(childrenPlaces));
    // console.log('unSelectedCities ===>', unSelectedCities);

    return(
        <Card title = {data.label} bodyStyle = {{padding:0}} extra = { (formData.id !== undefined)? <>
            <Button type="default" onClick = {()=>clearContent()}>Clear</Button>
        </>:<Button type="primary" onClick = {()=>addContent()}>Add Content</Button>}>
            { (formData.id !== undefined) && 
                <div style = {{padding:24}}>
                    <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish} onChange = {(event:any)=>{
                        setEdited(true);
                        const title = form.getFieldValue('title');
                        form.setFieldsValue({guid: `${parentPlace.guid}${generateUrlFromTitle(title)}/`});
                        }}>
                        Title:
                        <Form.Item
                            name="title"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input />
                        </Form.Item>
                        Learn More Link:
                        <Form.Item name = "guid">
                            <Input disabled />
                        </Form.Item>
                        Content:
                        <HTMLEditor ref = {editorRef} html = {formData.content} />

                        <br/>
                        Preview:
                        <div className = "imagePreview"> 
                            {renderPreviewField(thumbnail)}
                        </div>
                        <br/>
                        Places:
                        {
                            childrenPlaces.map((child:any, index:number)=>(
                                <Form.Item key={index}>
                                    <div className = "cityRow">
                                        <span>{index+1}.</span><Select value = {child.sub_place_id} onChange = {(val)=>onChangeChildPlace(val, index)}>
                                            {cities.map((ele, index)=>(<Option value = {ele.id} key = {index} disabled = {childrenPlaces.findIndex(cp=>cp.sub_place_id == ele.id) > -1 } >{ele.title}</Option>))}
                                        </Select>
                                        <Button className = "delBtnCity" onClick = {()=>removeCity(index)}><CloseOutlined /></Button>
                                    </div>
                                </Form.Item>
                            ))
                        }

                        <Form.Item>
                            <Button color="primary" onClick = {addMoreChildPlace}>Add Row</Button>
                        </Form.Item>

                        {
                        visibleActionButton && 
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Save</Button>
                            </Form.Item>
                        }
                    </Form>
                </div>
            }

            <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}}/>


        </Card>
    );

};

export default index;