import React, { useImperativeHandle, useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Tabs, Radio } from 'antd';
import { generateYoustSeoJSON } from 'utils';


const { Option } = Select;

interface Props {
    data:any;
}

const Index = React.forwardRef(({data}:Props, ref) => {

    const [form] = Form.useForm();

	const [seoDetail, setSeoDetail] = useState<any>(data.seo);
	const [editing, setEditing] = useState(false);
	const [isRequesting, setRequesting] = useState(false);

	useImperativeHandle(ref, () => (
		{
			getSeoDetail: () => {
				return form.getFieldsValue();
			}
		}
	), []);


	useEffect(()=>{
		if(seoDetail){
			const schema_json = seoDetail.schema_json;
			form.setFieldsValue({...schema_json, ...schema_json.robots });
		}
	}, [seoDetail]);

    return (
        <>
            <h1>Comming Soon</h1>
        </>
    );
});

export default Index;