import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor, Alert } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import GallerySection from '../../GallerySection';
import ExternalLinkSection from '../../ExternalLinkSection';
import HTMLEditor from 'components/HTMLEditor';
import { saveSEOData, createPlace, getPlaceDetail, searchPlaces, getAllPlacesWithTitle, updatePlaceDetail, getAllCities } from 'api/api-place';
import { getAllRegions } from 'api/api-region';

import history from 'modules/history';
import { PATHS } from 'constants/routes';

import config from 'api/config';
import GalleryDialog from 'components/GalleryDialog';
import CollapseCard from 'components/CollapseCard';
import HotelSection from '../../HotelSection';
import CommentSection from '../../CommentSection';
import CountryCategoryCard from './CountryCategoryCard';
import SEOCard from 'components/SEOCard';
import CityList from './CityList';

import { generateUrlFromTitle } from 'utils';
import MetadataGenerator from 'utils/metatag-generator';


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
    continents:any[],
}

const Index = ({ placeDetail, continents }:Props) => {

    const placeId = placeDetail.id;
    const editorRef = useRef<any>(null);
    const secondEditorRef = useRef<any>(null);
    const [searchParentTitle, setSearchParentTitle] = useState<any>([]);
    const [isAvailableonLive, setAvailableOnLive] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [allRegions, setAllRegions] = useState<any>([placeDetail.region]);

    const [placeContent, setPlaceContent] = useState<string>('');
    const [secondPlaceContent, setSecondPlaceContent] = useState<string>('');
    const [isRequesting, setIsRequesting] = useState(false);
    const [gallery, setGallery] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const seoCardRef = useRef<any>();


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
    const [form] = Form.useForm();

    useEffect(()=>{
        
        setAvailableOnLive(placeDetail.status == 'active');

        form.setFieldsValue(placeDetail);
        setPlaceContent(placeDetail.content);
        setGallery(placeDetail.gallery);
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

        let tempPlaceId = placeId;
        let schema_json;

        setErrors({});

        setIsRequesting(true);

        if(seoCardRef.current){ 

            const seoData : { schema_json: MetadataGenerator, thumbnail:any } =  seoCardRef.current.getSeoDetail();
            schema_json = seoData.schema_json;
            if(!seoData.thumbnail){
                alert('Please select a photo for place\'s thumbnail');
                return;
            }


            if (editorRef.current) {
                value.content = editorRef.current.getContent();
                value.second_page_content = secondEditorRef.current.getContent();
            }
            
            value.thumbnail_photo_id = (seoData.thumbnail)?seoData.thumbnail.id:null;
            
            if(parseInt(tempPlaceId) > 0){
                const response = await updatePlaceDetail(tempPlaceId, value);
                setAvailableOnLive(response.body.status == 'active');
            }else{
                const parentPlaceObj = continents.filter((ele)=>ele.id == parseInt(value.place_parent));
                const subGuid = generateUrlFromTitle(value.title);
                const guid = `${parentPlaceObj[0].guid}${subGuid}/`;
                value.guid = guid;
                value.place_type = 'country';
                
                const response = await createPlace(value);
                if(response.body){
                    if(response.body.error){
                        // handle error
                        setErrors(response.body.error);
                    }else{
                        // history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}/${response.body.id}`);
                        tempPlaceId = response.body.id;
                    }
                }

                //seo part
                schema_json.setOgImage([{id:seoData.thumbnail.id, alt: seoData.thumbnail.description, width: seoData.thumbnail.sizes['large-width'], height: seoData.thumbnail.sizes['large-height'], url: seoData.thumbnail.sizes.large, type:'image/jpeg' }]);

                schema_json.addWebPageGraphObj({url:value.guid, name: schema_json.title});

                schema_json.setOgUrl(value.guid);

                schema_json.setTwitterImage(seoData.thumbnail.sizes.large);
            }

            //update seo detail
            const seoRes = await saveSEOData(tempPlaceId, { schema_json });
            history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}/${tempPlaceId}`);
        }

        setIsRequesting(false);

    };


    const handleSearch = (value:any) => {
        setSearchParentTitle(value);
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

    

    const options = continents.filter((ele:any)=>ele.title.includes(searchParentTitle)).map((d:any) => <Option key={d.id} value={`${d.id}`}>{d.title}</Option>);


    return (
        <>
            <Row gutter = {16}>
            <Col span = {20}>
                <Card id = "place-detail" title = {placeDetail.title} extra = {
                    placeId > 0 ? 
                    <>
                        {isAvailableonLive && <Button onClick = {()=>{window.open(`${config.fontend}${placeDetail.guid}`, '_blank');}}>Visit Page</Button>}
                        <Button style = {{backgroundColor:'#0ab068', color:'#fff', marginLeft:16}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Publish</Button>
                    </>
                    :
                    <>
                        <Button onClick = {()=>{form.submit();}}>Add As Draft</Button>
                        <Button style = {{backgroundColor:'#0ab068', color:'#fff', marginLeft:16}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Add New</Button>
                    </>

                    // <>
                    //     <Button onClick = {()=>{window.open(`${config.fontend}${placeDetail.guid}`, '_blank');}}>Visit Page</Button>
                    //     <Button style = {{backgroundColor:'#0ab068', color:'#fff'}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Publish</Button>
                    // </>
                }>
                    <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish}>

                    {
                        placeId > 0 && 
                        <>
                            Status:
                            <Form.Item
                                name="status"
                                rules={[{ required: true, message: 'required!' }]}
                            >
                                <Select
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        filterOption={false}
                                        style = {{width:'100%'}}
                                    >
                                    <Option value="active">Active</Option>
                                    <Option value="draft">Draft</Option>
                                </Select>
                            </Form.Item>
                        </>
                    }

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
                        
                        Content:
                        <HTMLEditor ref = {editorRef} html = {placeContent} />
                        <br/>
                        Second Content:
                        <HTMLEditor ref = {secondEditorRef} html = {secondPlaceContent} />
                    </Form>
                </Card>
                <br/>

                {placeDetail.children &&  <CityList id = "city-list-section" countryId = {placeId} cities = {placeDetail.children} />}

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
                <SEOCard placeDetail = {placeDetail} id = "seo-section" ref = {seoCardRef} />
                <br />
                <CommentSection id = "comments-section" placeId = {placeId} />
            </Col>
            <Col span = {4}>
                <Anchor offsetTop = {80} onClick={handleClick}>
                    <Link href="#place-detail" title="Place Info" />
                    <Link href="#city-list-section" title="City List" />
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