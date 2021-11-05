

import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { saveSEOData } from 'api/api-place';

const { Option } = Select;

interface Props {
    placeId:number;
    id?:string;
    data:any;
    toSave:boolean;
}
const index = ({ placeId, data, id, toSave }:Props) => {

    const [form] = Form.useForm();

    const [seoDetail, setSeoDetail] = useState<any>(data);
    const [editing, setEditing] = useState(false);
    const [isRequesting, setRequesting] = useState(false);

    useEffect(()=>{
        if(toSave && editing){
            form.submit();
        }
    }, [toSave]);

    useEffect(()=>{
        if(data){
            setSeoDetail(data);
        }
    }, [data]);


    useEffect(()=>{
        console.log('seoDetail ===>', seoDetail);
        if(seoDetail){
            const schema_json = seoDetail.schema_json;
            console.log('schema_json ===>',schema_json);
            form.setFieldsValue({...schema_json, ...schema_json.robots });
        }
    }, [seoDetail]);

    const [toggle, toggleCard] = useState(true);

    const onSave = (values:any) =>{
        let schema_json = {
            robots: {}
        };
        try {
            schema_json = seoDetail.schema_json;
        }catch(err){
            console.log(err);
        }
        const data = {
            schema_json: {
                ...schema_json,
                title: values.title, 
                description: values.description, 
                canonical: values.canonical, 
                robots: {
                    ...schema_json.robots,
                    index: values.index,
                    follow: values.follow,
                } 
            }
        };
        setRequesting(true);
        saveSEOData(placeId, data).then((res)=>{
            setEditing(false);
            setRequesting(false);
        }).catch(err=>console.log);
    };

    if(placeId == 0){
        return <Card id = {id} title = "SEO"><h1>Available after place's basic detail is ready.</h1></Card>;
    }

    return (
        <Card id = {id} title = "SEO" extra = {(<Button style = {{border:'none'}}  shape = "circle" onClick = {()=>toggleCard(!toggle)}>{toggle && <CaretUpOutlined />}{!toggle && <CaretDownOutlined />}</Button>)} bodyStyle = {{padding:0}}>
            {toggle && 
                <div style = {{padding:24}}>
                    <Form form={form} onChange = {()=>setEditing(true)} onFinish = {onSave}>
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

                        {/* <Form.Item>
                            {editing && <Button htmlType = "submit" type = "primary" loading = {isRequesting} >Save</Button>}
                        </Form.Item> */}
                    </Form>
                </div>
            }
        </Card>
    );
};

export default index; 