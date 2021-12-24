import React, { useImperativeHandle, useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Tabs, Radio, Typography } from 'antd';
import { generateYoustSeoJSON } from 'utils';
import PhotoPicker from 'components/PhotoPicker';
import GoogleSearchPreviewCard  from './GoogleSearchPreviewCard';


const { Option } = Select;

interface Props {
    data:any;
}

const Index = React.forwardRef(({data}:Props, ref) => {

    const [form] = Form.useForm();

    const [placeDetail, setPlaceDetail] = useState(data);
	const [editing, setEditing] = useState(false);

    useEffect(()=>{
        setPlaceDetail(data);
    }, [data]);
	

	useImperativeHandle(ref, () => (
		{
			getSeoDetail: () => {
				return { seo: form.getFieldsValue(), thumbnail: placeDetail.thumbnail };
			}
		}
	), [placeDetail]);

	useEffect(()=>{
		if(placeDetail.seo){
			const schema_json = placeDetail.seo.schema_json;
			form.setFieldsValue({...schema_json, ...schema_json.robots });
		}
	}, [placeDetail]);

    const onChangePhoto = (thumbnail:any) => {
        console.log('onChangePhoto ==>', thumbnail);
        setPlaceDetail({...placeDetail, thumbnail});
    };

    return (
        <>
            <Form form={form} onChange = {()=>setEditing(true)}>
                SEO Title:
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Input />
                </Form.Item>
                Meta Description:
                <Form.Item
                    name="description"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                Canonical URL:
                <Form.Item
                    name="canonical"
                >
                    <Input />
                </Form.Item>

                Allow search engines to show this Page in search results?
                <Form.Item
                    name="index"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Select style={{ width: 120 }} onChange = {()=>setEditing(true)}>
                        <Option value="index">Yes</Option>
                        <Option value="noindex">No</Option>
                    </Select>
                </Form.Item>

                Should search engines follow links on this Page
                <Form.Item
                    name="follow"
                    rules={[{ required: true, message: 'required!' }]}
                >
                    <Select style={{ width: 120 }} onChange = {()=>setEditing(true)}>
                        <Option value="follow">Yes</Option>
                        <Option value="nofollow">No</Option>
                    </Select>
                </Form.Item>
            </Form>

            <PhotoPicker photo = {placeDetail.thumbnail} onChangePhoto = {onChangePhoto} />
            <br />
            <GoogleSearchPreviewCard placeDetail = {placeDetail } />
        </>
    );
});

export default Index;