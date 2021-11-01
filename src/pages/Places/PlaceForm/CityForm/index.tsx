import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor, Alert } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import GallerySection from '../../GallerySection';
import ExternalLinkSection from '../../ExternalLinkSection';
import { Editor } from '@tinymce/tinymce-react';
import { createPlace, getPlaceDetail, searchPlaces, getAllPlacesWithTitle, updatePlaceDetail } from 'api/api-place';
import { getAllRegions } from 'api/api-region';

import history from 'modules/history';
import { PATHS } from 'constants/routes';


import config from 'api/config';
import GalleryDialog from 'components/GalleryDialog';
import CollapseCard from 'components/CollapseCard';
import HotelSection from '../../HotelSection';
import CommentSection from '../../CommentSection';
import CityCategoryCard from './CityCategoryCard';
import SEOCard from 'components/SEOCard';
import classes from './style.module.scss';
import { generateUrlFromTitle } from 'utils';

const { Option } = Select;
const { Link } = Anchor;

const menu = (
    <Menu>
      <Menu.Item>Action 1</Menu.Item>
      <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

interface Props {
    placeDetail:any
    allPlaces:any[]
}

const CityForm = ({ placeDetail, allPlaces }:Props) => {

    console.log('placeDetail ====>', placeDetail);

    const editorRef = useRef<any>(null);
    const secondEditorRef = useRef<any>(null);
    const [searchParentTitle, setSearchParentTitle] = useState<any>([]);
    const [searchRegionTitle, setSearchRegionTitle] = useState<any>('');
    const [cityDetail, setCityDetail] = useState(placeDetail);
    const [errors, setErrors] = useState<any>({});

    const placeId = cityDetail.id;
    

    const [allRegions, setAllRegions] = useState<any>([placeDetail.region]);
    const [thumbnail, setThumbnail] = useState<any>();
    const [placeContent, setPlaceContent] = useState<string>('');
    const [secondPlaceContent, setSecondPlaceContent] = useState<string>('');
    const [isRequesting, setIsRequesting] = useState(false);
    const [gallery, setGallery] = useState<any[]>([]);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);


    const [cityContents, setCityContents] = useState<any>({
        when_to_go:{
            label: 'Where To Go',
            content:'',
            title: ''
        },
        activities:{
            label:'Activities',
            content:'',
            title: ''
        },
        nightlife:{
            label:'Nightlife',
            content:'',
            title: ''
        },
        sights:{
            label:'Sights',
            content:'',
            title: ''
        },
        nature:{
            label:'Nature',
            content:'',
            title: ''
        },
        offthepath:{
            label:'Off The Path',
            content:'',
            title: ''
        }
    });
    // const log = () => {
    //     if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //     }
    // };
    const [form] = Form.useForm();

    const fetchMoreRegions = () => {
        getAllRegions(0, 20, searchRegionTitle).then((res)=>{
            // console.log('regions ===>', res.body);
            setAllRegions(res.body.data);
            // form.setFieldsValue(placeDetail);
        }).catch(err=>console.log);
    };

    useEffect(()=>{
        fetchMoreRegions();
    }, [searchRegionTitle]);

    useEffect(()=>{
        fetchMoreRegions();
    }, []);

    useEffect(()=>{
        cityDetail.region_id = `${cityDetail.region.id}`;

        if(cityDetail.region){
            cityDetail.bounds = cityDetail.region.bounds;
        }

        form.setFieldsValue(cityDetail);
        setPlaceContent(cityDetail.content);
        setGallery(cityDetail.gallery);
        setThumbnail(cityDetail.thumbnail);
        setSecondPlaceContent(cityDetail.second_page_content);
        const tempCityContent:any = cityContents;
        cityDetail.city_contents.forEach((element:any) => {
            const { content_key, title, id, content } = element;
            tempCityContent[content_key] = {
                ...cityContents[content_key],
                id, title, content
            };
        });
        setCityContents(tempCityContent);
    }, [cityDetail]);

    console.log('citycontent ==>', cityContents);

    const onFinish = async (value:any) => {
        setErrors({});
        if (editorRef.current) {
            value.content = editorRef.current.getContent();
            value.second_page_content = secondEditorRef.current.getContent();
        }

        if(!thumbnail){
            alert('Please select a photo for place\'s thumbnail');
            return;
        }
        value.thumbnail_photo_id = (thumbnail)?thumbnail.id:null;

        setIsRequesting(true);
        if(parseInt(placeId) > 0){
            await updatePlaceDetail(placeId, value);
        }else{

            const parentPlaceObj = allPlaces.filter((ele)=>ele.id == parseInt(value.place_parent));
            const subGuid = generateUrlFromTitle(value.title);
            const guid = `${parentPlaceObj[0].guid}${subGuid}/`;
            value.guid = guid;
            value.place_type = 'city';

            const response = await createPlace(value);
            if(response.body){
                if(response.body.error){
                    // handle error
                    setErrors(response.body.error);
                }else{
                    history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}/${response.body.id}`);

                }
                console.log('response ==>', response.body);
                
            }
        }
        setIsRequesting(false);
    };


    const handleSearch = (value:any) => {
        setSearchParentTitle(value);
    };

    const handleRegionSearch = (value:any) => {
        setSearchRegionTitle(value);
    };

    const onSelectPhoto = (ele:any) => {
        setVisibleGallery(false);
        setThumbnail(ele[0]);
    };

    const deleteThumbnail = () => {
        setThumbnail(null);
    };

    const onChooseImage = () => {
        setVisibleGallery(true);
    };

    const onRegionPopupScroll = (val:any) => {
        console.log('onRegionPopupScroll -->', val);
    };

    const handleClick = (
        e: React.MouseEvent<HTMLElement>,
        link: {
          title: React.ReactNode;
          href: string;
        },
    ) => {
        e.preventDefault();
        console.log(link);
    };

    

    const options = allPlaces.filter((ele:any)=>ele.title.includes(searchParentTitle) && ele.place_type == 'country').map((d:any) => <Option key={d.id} value={`${d.id}`}>{d.title}</Option>);
    const regionOptions = allRegions.filter((ele:any)=>(ele.region_title)?ele.region_title.includes(searchRegionTitle):false).map((d:any) => <Option key={d.id} value={`${d.id}`}>{d.region_title}</Option>);

    const renderPreviewField = (photo:any) => {
        console.log('photo ====>', photo);
        if(photo){
            return (
                <>
                    <img src = {photo.url} />
                    <div className = {classes.actionBar}>
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
        return (
            <Button type = "default" onClick={()=>onChooseImage()}>Add Image</Button>
        );
    };

    console.log('form ==>', form.getFieldValue('parent'));

    return (
        <>
        <Row gutter = {16}>
            <Col span = {20}>
                <Card id = "place-detail" title = {placeDetail.title} extra = {<><Button onClick = {()=>{
                    window.open(`${config.fontend}${placeDetail.guid}`, '_blank');
                }}>Visit Page</Button> <Button style = {{backgroundColor:'#0ab068', color:'#fff'}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Publish</Button></>}>

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



                    <div className = {classes.imagePreview}>
                        {renderPreviewField(thumbnail)}
                    </div>
                    <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish}>
                    Place title:
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'required!' }]}
                    >
                        <Input />
                    </Form.Item>

                        Search Label:
                        <Form.Item
                            name="search_label"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input />
                        </Form.Item>

                        Parent Place:
                        <Form.Item
                            name="place_parent"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Select
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                style = {{width:'100%'}}
                                onSearch={handleSearch}
                                // onChange={onChangeParentVal}
                                // notFoundContent={null}
                            >
                                {options}
                            </Select>
                        </Form.Item>
                        Longitude:
                        <Form.Item
                            name="longitude"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input />
                        </Form.Item>

                        Latitude:
                        <Form.Item
                            name="latitude"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input />
                        </Form.Item>

                        Region:
                        <Form.Item
                            name="region_id"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Select 
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                style = {{width:'100%'}}
                                onSearch={handleRegionSearch}
                                onPopupScroll = {onRegionPopupScroll}
                                >
                                {regionOptions}
                            </Select>
                        </Form.Item>

                        Bounds:
                        <Form.Item
                            name="bounds"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input />
                        </Form.Item>

                        List Label:
                        <Form.Item
                            name="list_label"
                            rules={[{ required: true, message: 'required!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        
                        Content:
                        <Editor
                            apiKey = "n16h33nt1xigk2hha9alkvvgxqyqa48akfey3cg9c6xdxxrc"
                            onInit={(evt, editor) => {
                                editorRef.current = editor;
                            }}
                            initialValue = {placeContent}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' + ' link image |' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}/>
                        <br/>
                        Second Content:
                        <Editor
                            apiKey = "n16h33nt1xigk2hha9alkvvgxqyqa48akfey3cg9c6xdxxrc"
                            onInit={(evt, editor) => {
                                secondEditorRef.current = editor;
                            }}
                            initialValue = {secondPlaceContent}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' + ' link image |' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}/>
                    </Form>
                </Card>
                <br/>
                <GallerySection id = "gallery-section" gallery = {gallery} placeId = {placeId} placeDetail = {cityDetail} toSave = {isRequesting} />
                <br/>

                <div id = "category-content">
                    {
                        Object.keys(cityContents).map((ele)=><CityCategoryCard data = {cityContents[ele]} key = {cityContents[ele].id} cityId = {placeId} contentKey = {ele} toSave = {isRequesting} />)
                    }
                </div>
                <br/>

                <HotelSection id = "hotels" hotels = {cityDetail.where_to_stay} cityId = {placeId} toSave = {isRequesting} />

                <br />
                
                <ExternalLinkSection id = "external-link-section" links = {cityDetail.external_links} cityId = {placeId} toSave = {isRequesting} />

                <br />

                 <SEOCard data = {cityDetail.seo} id = "seo-section" toSave = {isRequesting} placeId = {placeId} />

                <br />
                
                <CommentSection id = "comments-section" placeId = {placeId} />
            </Col>
            <Col span = {4}>
                <Anchor offsetTop = {80} onClick={handleClick}>
                    <Link href="#place-detail" title="Place Info" />
                    <Link href="#gallery-section" title="Gallery" />
                    <Link href="#category-content" title="Category Contents" />
                    <Link href="#hotels" title="Hotels" />
                    <Link href="#external-link-section" title="External Links" />
                    <Link href="#seo-section" title="SEO" />
                    <Link href="#comments-section" title="Comments" />

                    {/* <Link href="#API" title="API">
                        <Link href="#Anchor-Props" title="Anchor Props" />
                        <Link href="#Link-Props" title="Link Props" />
                    </Link> */}
                </Anchor>
            </Col>
        </Row>
        
        </>
    );
};

export default CityForm; 