import React, { useEffect, useState } from 'react';
import { getPublicOption, updatePublicUserOptions } from 'api/api-options';
import * as ConsultantAPI from 'api/api-consultants';
import * as ProductAPI from 'api/api-products';
import passwordGenerator from 'generate-password';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { Table, Checkbox } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

import { ConsultantType, ProductType } from 'modules/types';
import classes from './style.module.scss';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItemTr = SortableElement((props:any) => <tr {...props} />);
const SortableContainerTBody = SortableContainer((props:any) => <tbody {...props} />);


const PublicUserForm = () => {
    const userId = 0;
	const [form] = Form.useForm();
	const [isRequesting, setIsRequesting] = useState(false);
	const [allPublishedProducts, setAllPublishedProducts] = useState<ProductType[]>([]);
	const [assignedProducts, setAssignedProducts] = useState<string[]>([]);
	const [reloading, setReloading] = useState(0);

	const columns = [
		{
			title: 'Sort',
			dataIndex: 'sort',
			width: 30,
			className: 'drag-visible',
			render: () => <DragHandle />,
		},
		{
			title: 'Title',
			dataIndex: 'title',
			className: classes.dragVisible,
		},
		{
			title: 'Assigned',
			dataIndex: 'assigned',
			render: (val:any, item:any) => {
				return <Checkbox name = {item.ID} checked = {val} onChange = {onChangeChecBox}/>;
			}
		},
	];

	const onChangeChecBox = (e:any) => {
		console.log('onChangeChecBox --->', e.target.name, e.target.checked);
		const index = assignedProducts.findIndex(x=> parseInt(x) == parseInt(e.target.name));	
		if(index > -1){
			assignedProducts.splice(index, 1);
		}else{
			assignedProducts.push(e.target.name);
		}
		console.log('assignedProducts --->', assignedProducts);
		setAssignedProducts(assignedProducts);
		setReloading((reloading)=>reloading+1);
	};

	const sortProductsArray = (sources:ProductType[], sortArr:any[]) => {

		function arrayUnique(array:any[]) {
			const a = array.concat();
			for(let i=0; i<a.length; ++i) {
				for(let j=i+1; j<a.length; ++j) {
					if(a[i] === a[j])
						a.splice(j--, 1);
				}
			}
		
			return a;
		}

		console.log('sortArr --->', sortArr);
		
		const newArr = [];
		for(let i = 0; i < sortArr.length; i++){
			const p_id = sortArr[i];
			for(let j = 0; j < sources.length; j++){
				if(sources[j].ID == p_id){
					newArr.push(sources[j]);
				}
			}
		}
		return arrayUnique(newArr.concat(sources));
	};

	useEffect( () => {
		const fetchData = async () => {
            try{
				const proRes = await getPublicOption();
				form.setFieldsValue(proRes.body);
				setAssignedProducts(proRes.body.public_user_products.split(','));
                const productsRes = await ProductAPI.getAllPublishedProductsInOrder(userId);
                const orderArr = productsRes.body.orderArr;
                const products = sortProductsArray(productsRes.body.products, orderArr);
                setAllPublishedProducts(products);
				setReloading(reloading + 1);
            }catch(e:any){
                console.log(e.message);
            }
        };
        fetchData();
	}, []);


	useEffect(()=> {

		if(allPublishedProducts.length>0){
			//update all products
			const newArr = Array.from(allPublishedProducts);
			for(let i = 0; i < allPublishedProducts.length; i ++){
				const item = allPublishedProducts[i];
				if(assignedProducts.findIndex((x:any)=> parseInt(x) == item.ID) > -1){
					item.assigned = true;
				}else{
					item.assigned = false;
				}
			}
			setAllPublishedProducts(newArr);
		}

	}, [reloading]);

	console.log('published all products -->', allPublishedProducts);

	const getOrderedProductsStr = () => {
		const arr:any[] = [];
		allPublishedProducts.forEach((element:ProductType) => {
			arr.push(element.ID);
		});
		return arr.join(',');
	};

	const onFinish = () => {
		setIsRequesting(true);
		const formData = form.getFieldsValue();
		formData.products = assignedProducts.join(',');
		formData.orderArr = getOrderedProductsStr();
		updatePublicUserOptions(formData)
		.then((res) => {
			setIsRequesting(false);
		})
		.catch((e) => {
			setIsRequesting(false);
		});
	};

	const DraggableContainer = (props:any) => (
		<SortableContainerTBody
			useDragHandle
			disableAutoscroll
			helperClass={classes.rowDragging}
			onSortEnd={onSortEnd}
			{...props}
		/>
	);
	
	const DraggableBodyRow = ({ ...restProps }) => {
		// const { dataSource } = this.state;
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = allPublishedProducts.findIndex(x => x.ID === restProps['data-row-key']);
		return <SortableItemTr index={index} {...restProps} />;
	};

	const onSortEnd = ({ oldIndex, newIndex }:any) => {
		if (oldIndex !== newIndex) {
			const newArr = Array.from(allPublishedProducts);
			const newData = arrayMove(newArr, oldIndex, newIndex).filter((el:any) => !!el);
			console.log('Sorted items: ', newData);
			setAllPublishedProducts(newData);
		}
	};


	return (
		<>
			<Form form={form} style={{ marginTop: 20 }} onFinish={onFinish}>
				<Table
						style = {{marginBottom:32}}
						pagination={false}
						dataSource={allPublishedProducts}
						columns={columns}
						rowKey="ID"
						components={{
							body: {
								wrapper: DraggableContainer,
								row: DraggableBodyRow,
							},
						}}
				/>
				
				<Form.Item
					label="Over Base Price"
					name="base_over_percentage"
					tooltip={{ title: 'Base price of product', icon: <InfoCircleOutlined /> }}
				>
					<InputNumber
						defaultValue={0}
						formatter={(value) => `% ${value}`}
						parser={(value: any) => value.replace(/%\s?|(,*)/g, '')}
					/>
				</Form.Item>

				<Form.Item label="Apply Bundling Discount" name = "apply_bundling_discount" tooltip = {{title: 'By checking this option a bundling discount will apply a $500 discount to each product after the first that is added to an order. If a user ONLY orders a single item, there is no discount applied.', icon:<InfoCircleOutlined />}} valuePropName="checked">
					<Checkbox />
				</Form.Item>
				
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={isRequesting}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default PublicUserForm;