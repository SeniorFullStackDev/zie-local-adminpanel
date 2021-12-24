import React, { useImperativeHandle, useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Tabs, Radio } from 'antd';
import { generateYoustSeoJSON } from 'utils';
import PhotoPicker from 'components/PhotoPicker';

const { Option } = Select;

interface Props {
    data:any;
}

const Index = React.forwardRef(({data}:Props, ref) => {
    console.log('data =====>', data.seo);
    const [form] = Form.useForm();
	const [twitterDetail, setTwitterDetail] = useState<any>({
        og_title: '',
        og_description: '',
        twitter_misc:{
            'Est. reading time': '1 minute'
        },
        twitter_card:'summary',
    });
	const [editing, setEditing] = useState(false);
    const [thumbnail, setThumbnail] = useState<any>();

	useImperativeHandle(ref, () => (
		{
			getSeoDetail: () => {
                const result = {
                    ...twitterDetail,
                    ...form.getFieldsValue(),
                    og_image: [ thumbnail ]
                };
				return result; 
			}
		}
	), [thumbnail]);


	useEffect(()=>{
		if(data.seo){
			form.setFieldsValue(data.seo.schema_json);
            if(data.seo.schema_json.og_image){
                setThumbnail(data.seo.schema_json.og_image[0]);
            }
		}
	}, [data]);

    const onChangePhoto = (photo:any) => {
        setThumbnail(photo);
    };

    return (
        <>
            <PhotoPicker photo = {thumbnail} onChangePhoto = {onChangePhoto} />
            <br />
            <Form form={form} onChange = {()=>setEditing(true)}>
                Twitter Title:
                <Form.Item
                    name="og_title"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Input />
                </Form.Item>
                Twitter Description:
                <Form.Item
                    name="og_description"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </>
    );
});

export default Index;