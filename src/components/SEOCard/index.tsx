

import React, { useImperativeHandle, useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Tabs, Radio } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { saveSEOData } from 'api/api-place';
import { generateYoustSeoJSON } from 'utils';
import MetadataGenerator from 'utils/metatag-generator';
import GoogleCard from './GoogleCard';
import SEOAnalysisCard from './SEOAlalysisCard';
import ReadabilityCard from './ReadabilityCard';
import FacebookCard from './FacebookCard';
import TwitterCard from './TwitterCard';

const { Option } = Select;

const { TabPane } = Tabs;


interface Props {
    id?:string;
    placeDetail:{seo:any};
}
const index = React.forwardRef(({id, placeDetail}:Props, ref) => {

	console.log('placeDetail ==>', placeDetail);

    const googleCardRef = useRef<any>();
    const seoAnalysisRef = useRef<any>();
    const readablityCardRef = useRef<any>();
    const facebookCardRef = useRef<any>();
    const twitterCardRef = useRef<any>();

	const getSeoValues = () => {
		const seoDetail = googleCardRef.current.getSeoDetail();
		const googleValues = seoDetail.seo;
		const thumbnail = seoDetail.thumbnail;

		let schema_json;
		let options;
		try {
			if(seoDetail){
				options = seoDetail.schema_json;
			}
			schema_json = generateYoustSeoJSON(options);
		}catch(err){
			console.log(err);
		}

		if(schema_json){
			schema_json.setTitle(googleValues.title);
			schema_json.setDescription(googleValues.description);
			schema_json.setCanonical(googleValues.canonical);
			schema_json.setRobots({index: googleValues.index, follow: googleValues.follow});

			if(facebookCardRef.current){
				const ogDetail = facebookCardRef.current.getSeoDetail();
				// set og data
				schema_json.setOgTitle(ogDetail.og_title);
				schema_json.setOgDescription(ogDetail.og_description);
				schema_json.setOgLocal(ogDetail.og_locale);
				schema_json.setOgType(ogDetail.og_type);
				schema_json.setOgSiteName(ogDetail.og_site_name);
				schema_json.setOgImage(ogDetail.og_image);
			}
			
		}

		return { schema_json,  thumbnail };
	};

	useImperativeHandle(ref, () => (
		{
			getSeoDetail: () => {
				return getSeoValues();
			}
		}
	), []);

	const [toggle, toggleCard] = useState(true);

	


	return (
		<Card id = {id} title = "SEO" extra = {(<Button style = {{border:'none'}}  shape = "circle" onClick = {()=>toggleCard(!toggle)}>{toggle && <CaretUpOutlined />}{!toggle && <CaretDownOutlined />}</Button>)} bodyStyle = {{padding:0}}>
			{toggle && 
                <div style = {{padding:24}}>
                    <Tabs defaultActiveKey="google" type="card">
                        <TabPane tab="Google" key="google">
                            <GoogleCard data = {placeDetail} ref = {googleCardRef} />
                        </TabPane>
                        <TabPane tab="SEO Analysis" key="seo-analysis">
                            <SEOAnalysisCard data = {placeDetail} ref = {seoAnalysisRef}/>
                        </TabPane>
                        <TabPane tab="Readability" key="readability">
                            <ReadabilityCard data = {placeDetail} ref = {readablityCardRef} />
                        </TabPane>
                        <TabPane tab="Facebook Card" key="facebook-card">
                            <FacebookCard data = {placeDetail} ref = {facebookCardRef} />
                        </TabPane>
                        <TabPane tab="Twitter Card" key="twitter-card">
                            <TwitterCard data = {placeDetail} ref = {twitterCardRef} />
                        </TabPane>
                    </Tabs>
                </div>
			}
		</Card>
	);
});

export default index; 