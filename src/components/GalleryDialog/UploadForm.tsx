import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Tabs, Input, Image, Form, Upload } from 'antd';
import { CheckSquareFilled, MinusSquareFilled, InboxOutlined, FileImageOutlined} from '@ant-design/icons';
import { createPhoto } from 'api/api-photo';
import config from 'api/config';
import classes from './style.module.scss';

interface Props {
    onFinishedUpload:(ele:any[])=>void;
}

export const UploadForm = ({ onFinishedUpload }:Props) => {

    // const [file, setFile] = useState<any>({});

    const [loading, setLoading] = useState(false);

    const [fileList, setFilelist] = useState<any[]>([]);

    const props = {
        name: 'file',
        multiple: true,
        action: `${config.host}/api/photos/upload`,
        headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
        fileList,
        showUploadList:true,
        onChange(info:any) {
          const { status } = info.file;
          console.log('info.file.percent ---->', info.file.percent);
          setFilelist(info.fileList);
        //   if (status === 'uploading') {

        //   }
          if (status === 'done') {
            setFilelist(info.fileList);
          } else if (status === 'error') {
            console.log(`${info.file.name} file upload failed.`);
          }
            // setActiveTab('1');
            // setFile(info.file);
        },
        onDrop(e:any) {
          console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [form] = Form.useForm();

    const onFinish = (values:any) => {
        // values.fileName = file.response.fileName;
        console.log('values ===>', fileList);

        const createPhotos = async () => {

            const newPhotos = [];

            for(let i = 0; i < fileList.length; i++){
                values.fileName = fileList[i].response.fileName;
                try {
                    const res = await createPhoto(values);
                    newPhotos.push(res.body.photo);
                }catch(error:any){
                    console.log('error ==>', error.message);
                }
            }
            setLoading(false);
            setFilelist([]);
            onFinishedUpload(newPhotos);
        };
        createPhotos();
        setLoading(true);
        
    };


    // let fileLink;
    // try {
    //     fileLink = file.response.fileLink;
    // }catch(error){
    //     console.log('error ==>', error.message);
    // }


    return (
        <>
            <Row>
                <div className={classes.uploadBox}>
                    <Upload.Dragger {...props}>
                        <div>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </div>
                    </Upload.Dragger>
                </div>
            </Row>
            <br />
            <Row>
                <Col span={12}>
                    <div style = {{padding:8}}>
                        <Form form = {form} labelCol = {{span:24}} wrapperCol = {{span:24}} onFinish = {onFinish}>
                            <Form.Item label="Alt:" name = "alt">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description:" name = "description">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item>
                                <Button style = {{marginRight:0, marginLeft:'auto'}} type = "primary" htmlType ="submit" loading = {loading}>Save</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    );
};