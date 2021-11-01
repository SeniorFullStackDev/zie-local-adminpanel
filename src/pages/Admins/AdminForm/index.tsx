import React, { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Anchor } from 'antd';
import { getAdminDetail, updateAdminDetail, createNewAdmin, getNew2FAQRCode, testG2faVerify } from 'api/api-admin';
import generator from 'generate-password';

const { Option } = Select;

const AdminForm = ({match}:any) => {
    const adminId = match.params.adminId;
    const [form] = Form.useForm();
    const [adminDetail, setAdminDetail] = useState<any>({});
    const [isRequesting, setIsRequesting] = useState(false);
    const [visiblePassGenerator, setVisiblePassGenerator] = useState(false);
    const [newpassword, setNewpassword] = useState('');
    const [visible2FAForm, setVisible2FAForm] = useState(false);
    const [g2FAData, set2FAData] = useState({qrcode:'', secretKey:''});
    const [responseMessage, setResponseMessage] = useState({g2fa:''});

    useEffect(()=>{
        if(adminDetail) form.setFieldsValue(adminDetail);
    }, [adminDetail]);

    useEffect(()=>{
        if(parseInt(adminId) > 0){
            //get admin detail
            getAdminDetail(adminId).then((res)=>{
                console.log('getAdminDetail ====>', res.body);
                setAdminDetail(res.body);
                setVisible2FAForm(res.body.google2fa_enabled == 'yes');
                set2FAData({...g2FAData, qrcode:res.body.qrcode});
            }).catch(err=>console.log);
        }
    }, [adminId]);

    const QRCode = (qrcode:string) => {
		if(qrcode.includes('<?xml')){
			return <div dangerouslySetInnerHTML = {{__html: qrcode}} />;
		}else{
			return <img src={qrcode} />;
		}
	};

    const onFinish = async (value:any) => {
        console.log('----onFinish----', value);
        if(visiblePassGenerator){
            value.password = newpassword;
        }
        setIsRequesting(true);
        if(parseInt(adminId) > 0){
            await updateAdminDetail(adminId, value);
        }else{
            await createNewAdmin(value);
        }
        setIsRequesting(false);
        setVisiblePassGenerator(false);
    };

    const onChange2FAFlag = (value:any) => {
        setVisible2FAForm(value==='yes');
        if(value==='yes'){
            getNew2FAQRCode().then((res:any)=>{
                set2FAData(res.body);
            }).catch((err:any)=>{
                console.log('Error ===>', err);
            });
        }
    };

    const onFinish2FAForm = async () => {
        const values = form.getFieldsValue();
        values.google2fa_secret = g2FAData.secretKey;
        if(parseInt(adminId) > 0){
            await updateAdminDetail(adminId, values);
        }else{
            await createNewAdmin(values);
        }
        setIsRequesting(false);
    };

    const onVerifyCode = (code:any) => {
        setIsRequesting(true);
        setResponseMessage({...responseMessage, g2fa:''});
        testG2faVerify({code, secretKey: g2FAData.secretKey}).then((res:any)=>{
            setIsRequesting(false);
            console.log('testG2faVerify ===>', res.body);
            if(res.body.success){
                setResponseMessage({...responseMessage, g2fa:'Verifyed!'});
            }else{
                setResponseMessage({...responseMessage, g2fa:'Failed.'});
            }
        }).catch((err:any)=>{
            console.log(err);
        });
    };

    return (
        <>
        <Row gutter = {16}>
            <Col span = {24}>
                <Card title = {adminDetail.name} extra = {<Button style = {{backgroundColor:'#0ab068', color:'#fff'}} loading = {isRequesting} onClick = {()=>{form.submit();}}>Save</Button>}>
                    <Form form = {form} style={{ marginTop: 20 }} onFinish={onFinish}>
                        Admin Name:
                        <Form.Item name = "name" rules={[{ required: true, message: 'required!' }]}>
                            <Input />
                        </Form.Item>
                        Email:
                        <Form.Item name = "email" rules={[{ required: true, message: 'required!' }]}>
                            <Input />
                        </Form.Item>

                        New Password:
                        <div>
                            <Button onClick = {()=>{
                                setVisiblePassGenerator(true);
                                const password = generator.generate({
                                    length: 10,
                                    numbers: true
                                });
                                setNewpassword(password);
                            }}>Set New Password</Button>
                        </div>
                        <br />
                        {visiblePassGenerator &&<div style = {{width:'max-content', display:'flex'}}>
                            <Input value = {newpassword} onChange = {(e:any)=>{ setNewpassword(e.target.value);}} />
                            <Button onClick = {()=>{setVisiblePassGenerator(false);}}>Cancel</Button>
                        </div>}
                        <br />
                        Role:
                        <Form.Item name = "role" rules={[{ required: true, message: 'Choose role' }]}>
                            <Select style={{ width: 300 }}>
                                <Option value="administrator">Administrator</Option>
                                <Option value="editor">Editor</Option>
                            </Select>
                        </Form.Item>

                        2FA:
                        <Form.Item name = "google2fa_enabled">
                            <Select style={{ width: 300 }} defaultValue = "no" onChange = {onChange2FAFlag}>
                                <Option value="yes">Yes</Option>
                                <Option value="no">No</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button danger type = "primary">Delete User</Button>
                        </Form.Item>
                    </Form>
                </Card>
                {
                    visible2FAForm && 
                    <Card title = {<b>2FA instructions</b>} style = {{marginTop:16}}>
                        <Form onFinish = {onFinish2FAForm}>
                            <div>
                                <p>
                                    1. Install Google Authenticator, Authy, Microsoft Authenticator, Yubico Authenticator
                                </p>
                                <p>
                                    2. Open the app, select “Add Account” 
                                </p>
                                <p>
                                    3. Scan the QR code below
                                    <div>
                                    {g2FAData.qrcode && QRCode(g2FAData.qrcode)}
                                    </div>
                                </p>
                                <p>
                                    4. OR enter the secret key into Authenticator app manually:
                                    <div><b>{g2FAData.secretKey}</b></div>
                                </p>
                                <p>
                                    5. Enter the 6-digit verification code generated by <br/> your Authenticator app
                                </p>

                                {g2FAData.secretKey !== '' && 
                                    <Input.Search enterButton="Verify" style = {{width:300}} onSearch = {onVerifyCode} loading = {isRequesting}/>
                                }
                                {responseMessage.g2fa !== '' && <div style = {{fontWeight:'bold'}}>{responseMessage.g2fa}</div>}
                            </div>
                            <br/>
                            {g2FAData.secretKey !== '' && 
                                <Form.Item>
                                    <Button type = "primary" htmlType = "submit">Save</Button>
                                </Form.Item>
                            }
                        </Form>
                    </Card>
                }
            </Col>
        </Row>
        </>
    );
};

export default AdminForm;