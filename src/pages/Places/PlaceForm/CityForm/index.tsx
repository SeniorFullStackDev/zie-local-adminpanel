import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor, Alert } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined, FileImageFilled } from '@ant-design/icons';
import GallerySection from '../../GallerySection';
import ExternalLinkSection from '../../ExternalLinkSection';
// import { Editor } from '@tinymce/tinymce-react';
import HTMLEditor from 'components/HTMLEditor';
import { saveSEOData, createPlace, getPlaceDetail, searchPlaces, getAllPlacesWithTitle, updatePlaceDetail } from 'api/api-place';
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
    placeDetail:any
    allPlaces:any[]
}

const CityForm = ({ placeDetail, allPlaces }:Props) => {

    const editorRef = useRef<any>(null);
    const secondEditorRef = useRef<any>(null);
    const [searchParentTitle, setSearchParentTitle] = useState<any>([]);
    const [searchRegionTitle, setSearchRegionTitle] = useState<any>('');
    const [cityDetail, setCityDetail] = useState(placeDetail);
    const [errors, setErrors] = useState<any>({});

    const placeId = cityDetail.id;
    

    const [allRegions, setAllRegions] = useState<any>([placeDetail.region]);
    const [placeContent, setPlaceContent] = useState<string>('');
    const [secondPlaceContent, setSecondPlaceContent] = useState<string>('');
    const [isRequesting, setIsRequesting] = useState(false);
    const [gallery, setGallery] = useState<any[]>([]);
    const [visibleGalleryDialog, setVisibleGallery] = useState(false);
    const [isAvailableonLive, setAvailableOnLive] = useState(false);

    const seoCardRef = useRef<any>();


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

    const [form] = Form.useForm();

    const fetchMoreRegions = () => {
        getAllRegions(0, 20, searchRegionTitle).then((res)=>{
            setAllRegions(res.body.data);
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

        if(cityDetail.region.id){
            cityDetail.bounds = cityDetail.region.bounds;
        }

        setAvailableOnLive(cityDetail.status == 'active');

        form.setFieldsValue(cityDetail);
        setPlaceContent(cityDetail.content);
        setGallery(cityDetail.gallery);
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

            //normal update
            if(parseInt(tempPlaceId) > 0){
                //update place 's basic info
                const response = await updatePlaceDetail(tempPlaceId, value);
                setAvailableOnLive(response.body.status == 'active');
            }else{
                // create
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
                        tempPlaceId = response.body.id;
                    }
                }

                //seo part
                schema_json.setOgImage([{id:seoData.thumbnail.id, alt: seoData.thumbnail.description, width: seoData.thumbnail.sizes['large-width'], height: seoData.thumbnail.sizes['large-height'], url: seoData.thumbnail.sizes.large, type:'image/jpeg' }]);

                schema_json.addWebPageGraphObj({url:value.guid, name: schema_json.title});

                schema_json.setOgUrl(value.guid);

                schema_json.setTwitterImage(seoData.thumbnail.sizes.large);
                
            }

            const seoRes = await saveSEOData(tempPlaceId, { schema_json });

            history.push(`${PATHS.DASHBOARD}${PATHS.PLACES}/${tempPlaceId}`);

        }

        setIsRequesting(false);
    };


    const handleSearch = (value:any) => {
        setSearchParentTitle(value);
    };

    const handleRegionSearch = (value:any) => {
        setSearchRegionTitle(value);
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
                        <HTMLEditor ref = {editorRef} html = {placeContent} />
                        <br/>
                        Second Content:
                        <HTMLEditor ref = {secondEditorRef} html = {secondPlaceContent} />
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

                 <SEOCard placeDetail = {cityDetail} id = "seo-section" ref = {seoCardRef} />

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