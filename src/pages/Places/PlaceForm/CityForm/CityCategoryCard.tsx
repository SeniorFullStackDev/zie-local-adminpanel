import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { createCityContent, updateCityContent, deleteCityContent} from 'api/api-place';
import { Editor } from '@tinymce/tinymce-react';

interface Props {
    data:any,
    cityId:any,
    contentKey:any,
    toSave:boolean,
}

const index = ({contentKey, cityId, data, toSave}:Props) => {

    const editorRef = useRef<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();

    useEffect(()=>{
        if(toSave){
            form.submit();
        }
    }, [toSave]);

    useEffect(()=>{
        setFormData(data);
    }, []);

    useEffect(()=>{
        form.setFieldsValue({...data, ...formData});
    }, [formData]);

    const onFinish = (values:any) => {

        if(values.title){
            if (editorRef.current) {
                values.content = editorRef.current.getContent();
            }
    
            const id = formData.id;
            values.city_id = cityId;
            values.content_key = contentKey;
    
            setSaving(true);
    
            if(id){
                // update
                updateCityContent(id, values).then((res)=>{
                    // setFormData(res.body);
                    setSaving(false);
                }).catch(err=>console.log);
    
            }else{
                // create
                createCityContent(values).then((res)=>{
                    setFormData(res.body);
                    setSaving(false);
                }).catch(err=>console.log);
            }
        }

    };

    const clearContent = () => {
        console.log('onClear Content ==>');
        // form.setFieldsValue({});
        const id = formData.id;
        if(id){
            //delete
            deleteCityContent(id).then((res)=>{
                console.log(res.body);
            }).catch(err=>console.log);
        }
        setFormData({});
    };

    const addContent = () => {
        setFormData({id:0, title:'', content:''});
    };

    if(cityId == 0){
        return <Card title = {data.label}><h1>Available after place's basic detail is ready.</h1></Card>;
    }

    return(
        <Card title = {data.label} bodyStyle = {{padding:0}} extra = { (formData.id !== undefined)? <>
            {/* <Button type="primary" onClick = {()=>form.submit()}>save</Button> &nbsp; */}
            <Button type="default" onClick = {()=>clearContent()}>Clear</Button>
        </>:<Button type="primary" onClick = {()=>addContent()}>Add Content</Button>}>
            { (formData.id !== undefined) && 
                <div style = {{padding:24}}>
                    <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish}>
                    Title:
                    <Form.Item
                        name="title"
                        // rules={[{ required: true, message: 'required!' }]}
                    >
                        <Input />
                    </Form.Item>
                    Content:
                    <Editor
                        apiKey = "n16h33nt1xigk2hha9alkvvgxqyqa48akfey3cg9c6xdxxrc"
                        onInit={(evt, editor) => {
                            editorRef.current = editor;
                        }}
                        initialValue = {formData.content}
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
                </div>
            }
        </Card>
    );

};

export default index;