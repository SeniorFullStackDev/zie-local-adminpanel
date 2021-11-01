import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Input, Alert } from 'antd';
import { createNewUser } from 'api/api-user';
import history from 'modules/history';

export default () => {
    const [form] = Form.useForm();
    const [isRequesting, setRequest] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const onFinish = (values:any) =>{
        console.log('____onFinish____');
        setRequest(true);
        createNewUser(values).then((res:any)=>{
            if(res.body.error){
                setErrors(res.body.error);
            }else{
                history.push('/dashboard/users');
            }
            setRequest(false);
        }).catch((err:any)=>{
            console.log(err);
            setRequest(false);
        });
    };
        
    const onClickSaveBtn = () => {
        form.submit();
    };

    return (
        <Card title={<span style = {{fontWeight:'bold'}}>Add New User</span>} extra = {<Button loading={isRequesting} style = {{backgroundColor:'#0ab068', color:'#fff'}} onClick = {onClickSaveBtn}>Save</Button>}>
            {
                Object.keys(errors).map((key:any, index:number)=>(
                    <Alert
                        message="Error"
                        description={errors[key]}
                        type="error"
                        closable
                        style = {{marginBottom:8}}
                    />
                ))
            }

            <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Form.Item
                        label="Nickname"
                        name="name"
                        rules={[{ required: true, message: 'required!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'required!' }]}
                    >
                        <Input />
                    </Form.Item>
            </Form>
        </Card>
    );
};