import React, { useRef, useEffect, useState } from 'react';
import { Form, Row, Col,Anchor, Card, Button } from 'antd';

import { createPlace, updatePlaceDetail, getAllCities, saveSEOData } from 'api/api-place';
import CountryCategoryCard from 'pages/Places/PlaceForm/CountryForm/CountryCategoryCard';

import SEOCard from 'components/SEOCard';
import config from 'api/config';


const { Link } = Anchor;


interface Props {
    placeDetail:any,
}

const Index = ({ placeDetail }:Props) => {

    const [cities, setCities] = useState<any[]>([]);

    const [isRequesting, setIsRequesting] = useState(false);

    const seoCardRef = useRef<any>();
    
    useEffect(()=>{
        if(placeDetail.category_page){
            if(placeDetail.category_page.place_id){
                getAllCities(placeDetail.category_page.place_id).then((res)=>{
                    console.log('getAllCities ====>', res.body);
                    setCities(res.body);
                }).catch(err=>{
                    console.log(err);
                });
            }
        }
    }, [placeDetail.category_page]);

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

    if(!placeDetail.category_page){
        return null;
    }

    const onFinish = async () => {

        //update seo detail
        if(seoCardRef.current){
            const seoRes = await saveSEOData(placeDetail.id, seoCardRef.current.getSeoDetail());
            console.log('seoRes ==>', seoRes.body);
        }
    };

    return (
        <>
            <Row gutter = {16}>
            <Col span = {20}>
                <Card id = "category-content" title = {placeDetail.category_page.category_page.title} bodyStyle = {{margin:0, padding:0, backgroundColor:'#f0f2f5'}} extra = {<><Button onClick = {()=>{
                    window.open(`${config.fontend}${placeDetail.category_page.category_page.guid}`, '_blank');
                }}>Visit Page</Button> <Button style = {{backgroundColor:'#0ab068', color:'#fff'}} loading = {isRequesting} onClick = {()=>{
                    
                    setIsRequesting(true);
                    setTimeout(() => {
                        setIsRequesting(false);
                    }, 2000);
                    onFinish();

                }}>Publish</Button></>}>
                    {placeDetail.category_page && <CountryCategoryCard contentKey="0" data = {placeDetail.category_page} parentPlace = {placeDetail.parent_place} categoryPageId = {placeDetail.category_page.id} countryId = {placeDetail.category_page.place_id} cities = {cities} toSave = {isRequesting} />}
                    <br/>
                    <SEOCard placeDetail = {placeDetail} id = "seo-section" ref = {seoCardRef} />
                </Card>
            </Col>
            <Col span = {4}>
                <Anchor offsetTop = {80} onClick={handleClick}>
                    <Link href="#category-content" title="Category Contents" />
                    <Link href="#seo-section" title="SEO" />
                </Anchor>
            </Col>
        </Row>
        </>
    );
};

export default Index; 