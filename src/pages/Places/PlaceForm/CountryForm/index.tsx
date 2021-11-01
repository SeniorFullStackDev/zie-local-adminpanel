import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import GallerySection from '../../GallerySection';
import ExternalLinkSection from '../../ExternalLinkSection';
import { Editor } from '@tinymce/tinymce-react';
import { createPlace, getPlaceDetail, searchPlaces, getAllPlacesWithTitle, updatePlaceDetail, getAllCities } from 'api/api-place';
import { getAllRegions } from 'api/api-region';

import config from 'api/config';
import GalleryDialog from 'components/GalleryDialog';
import CollapseCard from 'components/CollapseCard';
import HotelSection from '../../HotelSection';
import CommentSection from '../../CommentSection';
import CountryCategoryCard from './CountryCategoryCard';
import SEOCard from 'components/SEOCard';

import classes from './style.module.scss';
const { Option } = Select;
const { Link } = Anchor;

const menu = (
    <Menu>
      <Menu.Item>Action 1</Menu.Item>
      <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

interface Props {
    placeDetail:any,
    continetns:any[],
}

const Index = ({ placeDetail, continetns }:Props) => {

    console.log('placeDetail ====>', placeDetail);

    const placeId = placeDetail.id;
    const editorRef = useRef<any>(null);
    const secondEditorRef = useRef<any>(null);
    const [searchParentTitle, setSearchParentTitle] = useState<any>([]);
    // const [searchRegionTitle, setSearchRegionTitle] = useState<any>(placeDetail.region.region_title);


    const [allRegions, setAllRegions] = useState<any>([placeDetail.region]);
    const [thumbnail, setThumbnail] = useState<any>();
    const [placeContent, setPlaceContent] = useState<string>('');
    const [secondPlaceContent, setSecondPlaceContent] = useState<string>('');
    const [isRequesting, setIsRequesting] = useState(false);
    const [gallery, setGallery] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [categoryPages, setCategoryPages] = useState<any>({
        activities:{
            label:'Activities',
            category_page:{},
            category:{
                id:6
            },
            child_places: []
        },
        nightlife:{
            label:'Nightlife',
            category:{
                id:2
            },
            category_page:{},
            child_places: []
        },
        sights:{
            label:'Sights',
            category:{
                id:3
            },
            category_page:{},
            child_places: []
        },
        nature:{
            label:'Nature',
            category:{
                id:4
            },
            category_page:{},
            child_places: []
        },
        offthepath:{
            label:'Off The Path',
            category:{
                id:7
            },
            category_page:{},
            child_places: []
        },
        beach:{
            label:'Beach',
            category:{
                id:5
            },
            category_page:{},
            child_places: []
        }
    });
    // const log = () => {
    //     if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //     }
    // };
    const [form] = Form.useForm();

    useEffect(()=>{
        // getAllPlacesWithTitle(match.params.placeId).then(data=>{
        //     setAllPlaces(data.body);
        //     if(parseInt(match.params.placeId) > 0){
        //         getPlaceDetail(match.params.placeId).then(data=>{
        //             console.log('getPlaceDetail ===>', data.body);
        //             form.setFieldsValue(data.body);
        //             setPlaceDetail(data.body);
        //             setPlaceContent(data.body.content);
        //             setGallery(data.body.gallery);
        //             setThumbnail(data.body.thumbnail);
        //             setSecondPlaceContent(data.body.second_page_content);
        //         });
        //     }
        // });
        
        form.setFieldsValue(placeDetail);
        setPlaceContent(placeDetail.content);
        setGallery(placeDetail.gallery);
        setThumbnail(placeDetail.thumbnail);
        setSecondPlaceContent(placeDetail.second_page_content);

        const tempCategoryPages:any = categoryPages;
        placeDetail.category_pages.forEach((element:any) => {
            const { id, category_page, category, child_places } = element;
            const content_key = category.uri;
            tempCategoryPages[content_key] = {
                ...categoryPages[content_key],
                category_page,
                category,
                child_places,
                id
            };
        });
        setCategoryPages(tempCategoryPages);
    }, []);

    useEffect(()=>{
        if(placeDetail.id){
            getAllCities(placeDetail.id).then((res)=>{
                console.log('getAllCities ====>', res.body);
                setCities(res.body);
            }).catch(err=>{
                console.log(err);
            });
        }
    }, [placeDetail.id]);

    const onFinish = async (value:any) => {
        if (editorRef.current) {
            value.content = editorRef.current.getContent();
            value.second_page_content = secondEditorRef.current.getContent();
        }
        value.thumbnail_photo_id = (thumbnail)?thumbnail.id:null;

        setIsRequesting(true);
        if(parseInt(placeId) > 0){
            await updatePlaceDetail(placeId, value);
        }else{
            await createPlace(value);
        }
        setIsRequesting(false);
    };


    const handleSearch = (value:any) => {
        setSearchParentTitle(value);
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

    

    const options = continetns.filter((ele:any)=>ele.title.includes(searchParentTitle)).map((d:any) => <Option key={d.id} value={`${d.id}`}>{d.title}</Option>);
    // const regionOptions = allRegions.filter((ele:any)=>ele.region_title.includes(searchRegionTitle)).map((d:any) => <Option key={d.id} value={`${d.id}`}>{d.region_title}</Option>);


    console.log('categoryPages ==>', categoryPages);

    const renderPreviewField = (photo:any) => {
        if(photo){
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
        }
        return (
            <Button type = "default" onClick={()=>onChooseImage()}>Add Image</Button>
        );
    };

    return (
        <>
            <Row gutter = {16}>
            <Col span = {20}>
                <Card id = "place-detail" title = {placeDetail.title} extra = {<><Button onClick = {()=>{
                    window.open(`${config.fontend}${placeDetail.guid}`, '_blank');
                }}>Visit Page</Button> <Button style = {{backgroundColor:'#0ab068', color:'#fff'}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Publish</Button></>}>

                    <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}}/>

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
                <GallerySection id = "gallery-section" gallery = {gallery} placeId = {placeId} placeDetail = {placeDetail} toSave = {isRequesting} />
                <br/>
                {/* <CollapseCard title = "title">
                    <div>test</div>
                </CollapseCard> */}
                <div id = "category-content">
                    {
                        Object.keys(categoryPages).map((ele)=><CountryCategoryCard parentPlace = {placeDetail} data = {categoryPages[ele]} key = {categoryPages[ele].id} categoryPageId = {categoryPages[ele].id} countryId = {placeId} contentKey = {ele} cities = {cities} toSave = {isRequesting} />)
                    }
                </div>
                <br/>
                <ExternalLinkSection id = "external-link-section" links = {placeDetail.external_links} cityId = {placeId} toSave = {isRequesting}/>
                <br />
                <SEOCard data = {placeDetail.seo} id = "seo-section" toSave = {isRequesting} placeId = {placeId}/>
                <br />
                <CommentSection id = "comments-section" placeId = {placeId} />
            </Col>
            <Col span = {4}>
                <Anchor offsetTop = {80} onClick={handleClick}>
                    <Link href="#place-detail" title="Place Info" />
                    <Link href="#gallery-section" title="Gallery" />
                    <Link href="#category-content" title="Category Contents" />
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

export default Index; 