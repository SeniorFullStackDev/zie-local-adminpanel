import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select, Checkbox, Card  } from 'antd';
import { InfoCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import * as ProductAPI from 'api/api-products';
import * as OptionAPI from 'api/api-options';
import { ProductType } from 'modules/types';

import config from 'api/config';

import classes from './style.module.scss';

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

const ProductForm = ({ match }: any) => {
	const [form] = Form.useForm();
	const { productId } = match.params;
	const [portraitThumb, setPortraitThumb] = useState('');
	const [landscapeThumb, setLandscapeThumb] = useState('');
	// const [resourcePdf, setResourcePdf] = useState('');
	const [sliderShowImages, setSliderShowImages] = useState<any[]>([]);
	const [resourcePdfs, setResourcePdfs] = useState<any[]>([]);
	const [productDetail, setProductDetail] = useState<ProductType | any>();
	const [productOptions, setProductOptions] = useState<any[]>([]);
	const [allProducts, setAllProducts] = useState<any[]>([]);
	const [fileList, setFileList] = useState<any[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isDrafting, setIsDrafting] = useState(false);
	const [isPublshing, setIsPublishing] = useState(false);

	console.log('productOptions ---->', productOptions);

	useEffect(() => {
		OptionAPI.getAllTags().then((res: any) => {
			setProductOptions(res.body);
		});
		ProductAPI.getAllPublishedProducts().then((res:any)=>{
			setAllProducts(res.body.filter((el:any)=>{ return el.ID !== productId; }));
		});
	}, []);

	useEffect(() => {
		if (productId) {
			console.log('productId ----->', productId);
			if (parseInt(productId) > 0) {
				ProductAPI.getProductById(productId).then((res) => {
					console.log('getProductById ---->', res.body);
					res.body.tags = res.body.tags === null ? [] : res.body.tags.split(',');
					res.body.similar_product_ids = res.body.similar_product_ids === null ? [] : res.body.similar_product_ids.split(',');
					// setProductLogo(res.body.logo_url);
					setPortraitThumb(res.body.portrait_thumb || '');
					setLandscapeThumb(res.body.landscape_thumb || '');
					const rArr:any[] = [];
					if(res.body.resources){
						res.body.resources.split(',').forEach((element:any, index:number) => {
							rArr.push({uid: index, url:`${config.host}${element}`, status: 'done', name: `${res.body.title}-${index+1}.pdf`});
						});
					}
					setResourcePdfs(rArr);
					const arr:any[] = [];
					if(res.body.slider_images){
						res.body.slider_images.split(',').forEach((element:any, index:number) => {
							arr.push({uid: index, url:`${config.host}${element}`, status: 'done', thumbUrl:`${config.host}${element}`, name: `${res.body.title}-${index+1}.jpg`});
						});
					}
					setSliderShowImages(arr);
					form.setFieldsValue(res.body);
					setProductDetail(res.body);
				});
			}
		}
	}, [productId]);

	// const onFinish = () => {
	// 	const formData = form.getFieldsValue();
	// 	console.log('onFinish ---->', formData);
	// };

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 24 },
	};

	const PortraitProps: any = {
		name: 'file',
		action: `${config.baseURL}upload/file`,
		headers: {
			authorization: localStorage.getItem('token'),
		},
		showUploadList: false,
		onChange(info: any) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				// message.success(`${info.file.name} file uploaded successfully`);
				console.log('info.file.response.data.link --->', info.file.response.data.link);
				setPortraitThumb(info.file.response.data.link);
			} else if (info.file.status === 'error') {
				// message.error(`${info.file.name} file upload failed.`);
			}
		},
	};

	const LandscapeProps: any = {
		name: 'file',
		action: `${config.baseURL}upload/file`,
		headers: {
			authorization: localStorage.getItem('token'),
		},
		showUploadList: false,
		onChange(info: any) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				// message.success(`${info.file.name} file uploaded successfully`);
				console.log('info.file.response.data.link --->', info.file.response.data.link);
				setLandscapeThumb(info.file.response.data.link);
			} else if (info.file.status === 'error') {
				// message.error(`${info.file.name} file upload failed.`);
			}
		},
	};
	
	const ResourcesProps: any = {
		name: 'file',
		action: `${config.baseURL}upload/file`,
		headers: {
			authorization: localStorage.getItem('token'),
		},
		listType:'picture',
		showUploadList: true,
		fileList:resourcePdfs,
		accept: '.pdf',
		onChange(info: any) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'uploading') {
				setResourcePdfs([...info.fileList]);
			}
			if (info.file.status === 'done') {
				const newFile = {uid: info.file.uid, url:`${config.host}${info.file.response.data.link}`, status: 'done', thumbUrl:`${config.host}${info.file.response.data.link}`, name: `${info.file.name}.pdf`};
				resourcePdfs.pop();
				setResourcePdfs([...resourcePdfs, newFile]);
			} else if (info.file.status === 'error') {
				// message.error(`${info.file.name} file upload failed.`);
			}
		},
		onRemove(item:any) {
			const filtered = resourcePdfs.filter(function(el) { return el.uid !== item.uid; }); 
			setResourcePdfs(filtered);
		}
	};

	const SlideShowProps: any = {
		name: 'file',
		action: `${config.baseURL}upload/file`,
		headers: {
			authorization: localStorage.getItem('token'),
		},
		listType:'picture',
		showUploadList: true,
		fileList: sliderShowImages,
		accept:'.png, .jpg',
		onChange(info: any) {
			console.log(info);
			if (info.file.status === 'uploading') {
				setSliderShowImages([...info.fileList]);
			}
			if (info.file.status === 'done') {
				// message.success(`${info.file.name} file uploaded successfully`);
				console.log(info);
				console.log('info.file.response.data.link --->', info.file.response.data.link);
				const newFile = {uid: info.file.uid, url:`${config.host}${info.file.response.data.link}`, status: 'done', thumbUrl:`${config.host}${info.file.response.data.link}`, name: `${info.file.name}.jpg`};
				sliderShowImages.pop();
				setSliderShowImages([...sliderShowImages, newFile]);
			} else if (info.file.status === 'error') {
				// message.error(`${info.file.name} file upload failed.`);
			}
		},
		onRemove(item:any) {
			const filtered = sliderShowImages.filter(function(el) { return el.uid !== item.uid; }); 
			setSliderShowImages(filtered);
		}
	};


	const joinFileListToString = (source:any[]) => {
		const arr:string[] = [];
		source.forEach((e:any)=>{
				console.log('source --->', e);
				arr.push(e.url.replace(config.host, ''));
		});
		return arr.join(',');
	};
	const onClickSaveBtn = () => {
		
		form
			.validateFields()
			.then((formData) => {
				console.log('formData --->', formData);
				formData.ID = productDetail?.ID;
				formData.landscape_thumb = landscapeThumb;
				formData.portrait_thumb = portraitThumb;
				formData.resources = joinFileListToString(resourcePdfs);
				formData.similar_product_ids = formData.similar_product_ids.join(',');
				formData.slider_images = joinFileListToString(sliderShowImages);
				setIsSaving(true);
				if (productId == 'create') {
					ProductAPI.createProduct(formData).then((res) => {
						setIsSaving(false);
						setProductDetail({...formData, ID: res.body.insertId});
					});
				} else {
					ProductAPI.updateProduct(formData).then((res) => {
						setIsSaving(false);
					});
				}
			})
			.catch((err) => {
				console.log('ERROR =====>', err);
			});
	};

	console.log('product detail --->', productDetail);

	const onClickPublishBtn = () => {
		
		form
			.validateFields()
			.then((formData) => {
				formData.ID = productDetail?.ID;
				formData.landscape_thumb = landscapeThumb;
				formData.portrait_thumb = portraitThumb;
				formData.resources = joinFileListToString(resourcePdfs);
				formData.slider_images = joinFileListToString(sliderShowImages);
				formData.similar_product_ids = formData.similar_product_ids.join(',');
				formData.status = 'publish';
				setIsSaving(true);
				setIsPublishing(true);
				if (productId == 'create') {
					ProductAPI.updateProduct(formData).then((res) => {
						setIsSaving(false);
						setIsPublishing(false);
						setProductDetail({ ...productDetail, status: 'publish' });
					});
				} else {
					ProductAPI.updateProduct(formData).then((res) => {
						setIsSaving(false);
						setIsPublishing(false);
						setProductDetail({ ...productDetail, status: 'publish' });
					});
				}
			})
			.catch((err) => {
				console.log('ERROR =====>', err);
			});
	};

	const onClickDraftBtn = () => {
		setIsDrafting(true);
		ProductAPI.draftProduct(productDetail?.ID).then((res) => {
			setIsDrafting(false);
			setProductDetail({ ...productDetail, status: 'draft' });
		});
	};

	return (
		<>
			<Form form={form} {...layout}>
				<Form.Item
					label="Name"
					name="name"
					tooltip={{ title: 'Product Name', icon: <InfoCircleOutlined /> }}
					required
					rules={[{ required: true, message: 'Product Name is required!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Title"
					name="title"
					tooltip={{ title: 'Product Title', icon: <InfoCircleOutlined /> }}
					required
					rules={[{ required: true, message: 'Product Title is required!' }]}
				>
					<Input />
				</Form.Item>
				
				<Form.Item
					label="Secondary Title"
					name="secondary_title"
					tooltip={{ title: 'Product Secondary Title', icon: <InfoCircleOutlined /> }}
					required
					rules={[{ required: true, message: 'Product Secondary Title is required!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Sayduck Product UUID"
					name="sayduck_product_uuid"
					tooltip={{ title: 'Sayduck Producst UUID', icon: <InfoCircleOutlined /> }}
					required
					rules={[{ required: true, message: 'Product UUID is required!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Tags"
					name="tags"
					required
					rules={[{ required: true, message: 'Choose Tag' }]}
				>
					<Select
						mode="multiple"
						placeholder="Inserted are removed"
						// value={selectedItems}
						// onChange={this.handleChange}
						style={{ width: '100%' }}
					>
						{productOptions.map((item: any) => (
							<Select.Option key={item.ID} value={`${item.ID}`}>
								{item.tag_name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label="Similar Products"
					name="similar_product_ids"
					required
					rules={[{ required: true, message: 'Choose Similar Product' }]}
				>
					<Select
						mode="multiple"
						placeholder="Inserted are removed"
						// value={selectedItems}
						// onChange={this.handleChange}
						style={{ width: '100%' }}
					>
						{allProducts.map((item: any) => (
							<Select.Option key={item.ID} value={`${item.ID}`}>
								{item.title}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Row>
					<Col span={12}>
						<Form.Item label="- Landscape Thumbnail (Size: 1024w x 683h)">
							<Upload {...LandscapeProps}>
								<Button icon={<UploadOutlined />}>Click to Upload</Button>
							</Upload>
							<div className={classes.previewImage}>
								<img
									height={250}
									src={`${config.host}${landscapeThumb}`}
									// fallback="data:image/png;base64,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"
								/>
							</div>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="- Portrait Thumbnail (Size: 600w x 800h)">
							<Upload {...PortraitProps}>
								<Button icon={<UploadOutlined />}>Click to Upload</Button>
							</Upload>
							<div className={classes.previewImage}>
								<img
									height={250}
									src={`${config.host}${portraitThumb}`}
									// fallback="data:image/png;base64,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"
								/>
							</div>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					label="Base Price"
					name="base_price"
					tooltip={{ title: 'Base price of product', icon: <InfoCircleOutlined /> }}
					required
					rules={[{ required: true, message: 'Product base price is required!' }]}
				>
					<InputNumber
						defaultValue={0}
						style = {{width:'150px'}}
						formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
					/>
				</Form.Item>

				<Form.Item
					label="Description"
					name="description"
					tooltip={{ title: 'Product Description', icon: <InfoCircleOutlined /> }}
				>
					<Input.TextArea />
				</Form.Item>

				<h3> - Specifications - </h3>
				<Row>
					<Col span={12}>
						<Form.Item label="Width" name="width">
							<InputNumber
								style = {{width:'200px'}}
								formatter={value => `${value} mm`}
								parser={(value:any) => value.replace(/\s+/g, '').replace('mm', '') || 0}
								defaultValue={0}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="height" name="height">
							<InputNumber
								style = {{width:'200px'}}
								formatter={value => `${value} mm`}
								parser={(value:any) => value.replace(/\s+/g, '').replace('mm', '')}
								defaultValue={0}
							/>
						</Form.Item>
					</Col>
					<Col span = {12}>
					<Form.Item label="depth" name="depth">
						<InputNumber
							style = {{width:'200px'}}
							formatter={value => `${value} mm`}
							parser={(value:any) => value?.replace(/\s+/g, '').replace('mm', '')}
							defaultValue={0}
						/>
						</Form.Item>
					</Col>
					<Col span = {12}>
					<Form.Item label="weight" name="weight">
						<InputNumber
							style = {{width:'200px'}}
							formatter={value => `${value} kg`}
							parser={(value:any) => value?.replace(/\s+/g, '').replace('kg', '')}
							defaultValue={0}
						/>
					</Form.Item>
					</Col>
				</Row>

				<Form.Item label="- Resources -" name="resources">
					<Upload {...ResourcesProps} className="upload-list-inline">
						<Button icon={<UploadOutlined />}>Click to Upload</Button>
					</Upload>
				</Form.Item>

				<Form.Item label="- Photos for Slider (Size: any width x 800h)" name = "slider_images">
					<Upload {...SlideShowProps } className="upload-list-inline">
						<Button icon={<UploadOutlined />} >Click to Upload</Button>
					</Upload>
					{/* {resourcePdf &&
						<div className={classes.previewImage}>
							<a href = {`${config.host}${resourcePdf}`} target = "_blank">
								<DownloadOutlined /> &nbsp;
								Download Resource File
							</a>
						</div>
					} */}
				</Form.Item>

				<Form.Item name = "latest_product" valuePropName="checked">
					<Checkbox>
						Show this product as a 'latest product' on the home page
					</Checkbox>
				</Form.Item>

				<Form.Item>
					<div className={classes.formBtnGroup}>
						<Button type="primary" onClick={onClickSaveBtn} loading={isSaving}>
							Save
						</Button>
						{productDetail?.status === 'publish' && (
							<Button type="primary" onClick={onClickDraftBtn} loading={isDrafting}>
								Move To Draft
							</Button>
						)}
						{productDetail?.status !== 'publish' && (
							<Button type="primary" onClick={onClickPublishBtn} loading={isPublshing}>
								Publish
							</Button>
						)}
					</div>
				</Form.Item>
			</Form>
		</>
	);
};

export default ProductForm;
