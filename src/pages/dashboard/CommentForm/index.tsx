import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Checkbox } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { createComment, getCommentDetail, updateCommentDetail } from 'api/api-comments';
import { DownOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';

const { Option } = Select;

const CommentForm = ({match}:any) => {

    const commentId = match.params.commentId;
    const [isRequesting, setIsRequesting] = useState(false);
    
    const [form] = Form.useForm();
    console.log('commentId ===>', match.params.commentId);

    useEffect(()=>{
        getCommentDetail(match.params.commentId).then(data=>{
            console.log('commentDetail ===>', data.body);
            form.setFieldsValue(data.body);
        });
    }, []);


    const onFinish = async (value:any) => {
        setIsRequesting(true);
        if(parseInt(commentId) > 0){
            await updateCommentDetail(commentId, value);
        }else{
            await createComment(value);
        }
        setIsRequesting(false);
    };


    const handleSearch = (value:any) => {
        console.log('handleSearch --->', value);
    };

    return (
        <>
        <Card title = "Comment">
            <Form form={form} style={{ marginTop: 20 }} onFinish={onFinish}>
              Author Name:
              <Form.Item
                name="comment_author"
                rules={[{ required: true, message: 'required!' }]}
              >
                <Input />
              </Form.Item>

                Author Email:
				<Form.Item
					name="comment_author_email"
					rules={[{ required: true, message: 'required!' }]}
				>
					<Input />
				</Form.Item>

                Comment:
				<Form.Item
					name="comment_content"
					rules={[{ required: true, message: 'required!' }]}
				>
					<Input.TextArea />
				</Form.Item>

                Rate:
				<Form.Item
					name="ratings"
					rules={[{ required: true, message: 'required!' }]}
				>
					<Input />
				</Form.Item>

                <Form.Item label="Approve" name = "comment_approved"  valuePropName="checked">
					<Checkbox />
				</Form.Item>

                <br/>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isRequesting}>
                    Save
                  </Button>

                  <Button type="default" style={{marginLeft:16}} loading={isRequesting}>
                    Delete
                  </Button>
                </Form.Item>
            </Form>
        </Card>
        </>
    );
};

export default CommentForm; 