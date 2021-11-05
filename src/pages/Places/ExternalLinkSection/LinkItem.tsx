import React, { useRef, useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
//  

interface Props {
    data:any;
    onDelete?:()=>void;
    onSave?:(values:any)=>void;
    toSave:boolean;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};
  
const Index = ({data, onDelete, onSave, toSave}:Props) => {
    
    const [form] = Form.useForm();

    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState<any>();

    useEffect(()=>{
        if(toSave && editing){
            onSaveForm();
        }
    }, [toSave]);

    useEffect(()=>{
        form.setFieldsValue(formData);
    }, [formData]);

    useEffect(()=>{
        
        // form.setFieldsValue(data);
        setFormData(data);
    }, [data]);

    const onSaveForm = () => {
        const values = form.getFieldsValue();
        values.id = data.id;
        if(onSave) onSave(values);
    };

    const renderActionButton = () => {
        if(data.id > 0){
            if(editing || data.editing){
                return (
                    <>
                        {/* <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                            Save
                        </Button> */}
                        <Button type="default" onClick = {onDelete}>Delete Row</Button>
                    </>
                );
            }else{
                return <Button type="default" onClick = {onDelete}>Delete Row</Button>;
            }
        }else{
            return (
                <>
                    <Button type="primary" style = {{marginRight:20}} onClick = {onSaveForm}>
                        Create
                    </Button>
                    <Button type="default" onClick = {onDelete}>Cancel</Button>
                </>
            );
        }
    };

    const onChangeForm = () => {
        setEditing(true);
    };

    return (
        <div className = 'content'>
           <Form
                // {...layout}
                form={form}
                onChange = {onChangeForm}
                >
                <Row gutter = {8} >
                    <Col span = {12}>
                        Title:
                        <Form.Item
                            name="title"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span = {12}>
                        Url:
                        <Form.Item
                            name="url"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    {renderActionButton()}
                </Form.Item>
            </Form>
        </div>
    );
};

export default Index;