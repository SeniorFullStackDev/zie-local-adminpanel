import React, { useCallback, useEffect, useState } from 'react';
import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Tag, Space, Button, Modal, Form, Input, Card, Select, notification, Radio } from 'antd';
import { getAllCountries, getAllCities } from 'api/api-place';
import { getAllfakeUsers } from 'api/api-user';
import { createComment } from 'api/api-comments';
import { createNewUser } from 'api/api-user';
import usePlace from 'modules/place/place.hook';

interface Props {
    isModalVisible:boolean;
    onClose:(updated:boolean)=>void;
}

const Index = ({isModalVisible, onClose }:Props) => {

    const { place } = usePlace();

    console.log('usePlace ===>', place);

    const [disablePlacePick, setDisablePlacePick] = useState(false);

    const [form] = Form.useForm();
    const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

    useEffect(()=>{
		loadAllFakeUsers();
		loadAllCountries();
	},[]);

    useEffect(()=>{
        if(place.place_type == 'city'){
            form.setFieldsValue({
                country:place.parent.id,
                city: place.id
            });
            loadCities(place.parent.id);
            setDisablePlacePick(true);
        }else{
            setDisablePlacePick(false);
        }
    }, [place]);

    const [allFakeUsers, setFakeUsers] = useState<any>([]);
    const [allCities, setAllCities] = useState<any>([]);
    const [allCountries, setAllCountries] = useState<any>([]);
    const [isRequesting, setRequesting] = useState(false);

    const authorRef = React.useRef<any>();

    const loadAllFakeUsers = async () => {
		try {
			const { body } = await getAllfakeUsers();
			setFakeUsers(body);
		}catch(err:any){
			console.log(err);
		}
	};

	const loadAllCountries = async () => {
		try {
			const { body } = await getAllCountries();
			setAllCountries(body);
		}catch(err:any){
			console.log(err);
		}
	};

	const loadCities = async (countryId:any) => {
		try {
			const { body } = await getAllCities(countryId);
			setAllCities([{}, ...body]);
		}catch(err:any){
			console.log(err);
		}
	};


    const addNewUser = () => {
		console.log('---addNewUser--');
		console.log('new user ==>', authorRef.current);

		const email = authorRef.current;
		const name =  email.split('@')[0];

		setRequesting(true);

		createNewUser({name, email}).then((res:any)=>{
            if(res.body.error){
				console.log('res.body.error ==>', res.body.error);
				Object.keys(res.body.error).every((key:any, index:number)=>{
					console.log('res.body.error[key][0] ==>', res.body.error[key][0]);
					notification.open({
						type:'error',
						message: 'Error',
						description:res.body.error[key][0],
						onClick: () => {
							console.log('Notification Clicked!');
						},
					});
				});
            }else{
				const newuser = {
					name, email, id:res.body.id
				};
				setRequesting(false);
				notification.open({
					type:'success',
					message: 'Message',
					description:'New user is added.',
					onClick: () => {
						console.log('Notification Clicked!');
					},
				});
				setFakeUsers([newuser, ...allFakeUsers]);
            }
            // setRequest(false);
        }).catch((err:any)=>{
            console.log(err);
            // setRequest(false);
        });
	};


    const handleOk = () => {
		const values = form.getFieldsValue();
		values.place_id = values.country;
		if(values.city) values.place_id = values.city;
		if(values.user_id){
			const authorIndex = allFakeUsers.findIndex((ele:any)=>ele.id == values.user_id);
			values.comment_author_IP = allFakeUsers[authorIndex].user_ip;
		}
		setRequesting(true);
		createComment(values).then((res)=>{
			setRequesting(false);
			// setModalVisible(false);
			notification.open({
				type:'success',
				message: 'Message',
				description:'New comments is created succesfully.',
				onClick: () => {
					console.log('Notification Clicked!');
				},
			});

            //
            form.resetFields();
            if(place.place_type == 'city'){
                form.setFieldsValue({
                    country:place.parent.id,
                    city: place.id
                });
            }
            
		}).catch((err:any)=>{
			console.log('createComment ===>', err);
			setRequesting(false);
		});
	};

    return (
        <Modal
				title="Add Review"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel = {()=>onClose(false)}
				footer={[
					<Button key="back" onClick={()=>onClose(true)}>
						Close
					</Button>,
					<Button key="submit" type="primary" loading={isRequesting} onClick={handleOk}>
						Ok
					</Button>,
				]}
			>
				<Form form={form} {...layout}>
					<Form.Item
						label="Author"
						name="user_id"
						tooltip={{ title: 'Author', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'Author is required!' }]}
					>
						<Select 
                            
							showSearch 
							style={{ width: '100%' }} 
							notFoundContent = {(<div style = {{display:'flex', justifyContent:'space-between'}}><span>Not Found</span> <Button onClick = {addNewUser}>Add New</Button></div>)}
							filterOption={(input, option:any) => {
								authorRef.current = input.toLocaleLowerCase();
								return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
							}
							}>
							{
								allFakeUsers.map((ele:any, index:number)=>(
									<Select.Option key={ele.id} value={ele.id}>
										{ele.email}
									</Select.Option>
								))
							}
						</Select>
					</Form.Item>

					<Form.Item
						label="Country"
						name="country"
						required
						rules={[{ required: true, message: 'Country is required!' }]}
						tooltip={{ title: 'Country', icon: <InfoCircleOutlined /> }}
					>
						<Select 
                            disabled = {disablePlacePick}
							showSearch 
							style={{ width: '100%' }}
							onChange = {(val:any)=>{
								form.setFieldsValue({city:null});
								loadCities(val);
							}}
							filterOption={(input, option:any) => {
								if(option.children){
									return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
								}
								return false;
							}
							}>
							{
								allCountries.map((ele:any, index:number)=>(
									<Select.OptGroup label={ele.title}>
										{
											ele.countries.map((country:any, cIndex:number)=>(
												<Select.Option key={country.id} value={country.id}>
													{country.title}
												</Select.Option>
											))
										}
									</Select.OptGroup>
								))
							}

						</Select>
					</Form.Item>

					<Form.Item
						label="City"
						name="city"
						tooltip={{ title: 'City', icon: <InfoCircleOutlined /> }}
					>
						<Select 
                            disabled = {disablePlacePick}
							showSearch 
							style={{ width: '100%' }} 
							filterOption={(input, option:any) => {
                                if(option.children){
                                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }
                                return true;
							}
							}>
							{
								allCities.map((city:any, index:number)=>(
									<Select.Option key={city.id} value={city.id}>
										{city.title}
									</Select.Option>
								))
							}
						</Select>
					</Form.Item>

					<Form.Item label="Comments" name="comment_content" required>
						<Input.TextArea showCount style = {{minHeight: 100}} rows = {8} />
					</Form.Item>

					<Form.Item label="Rating" name="ratings" required>
						<Radio.Group style={{justifyContent: 'space-between', flexDirection:'row', flex:'1'}} buttonStyle="solid">
							<Space size="small">
								<Radio.Button value="1">1</Radio.Button>
								<Radio.Button value="2">2</Radio.Button>
								<Radio.Button value="3">3</Radio.Button>
								<Radio.Button value="4">4</Radio.Button>
								<Radio.Button value="5">5</Radio.Button>
							</Space>
						</Radio.Group>
					</Form.Item>
				</Form>
			</Modal>
    );
};

export default Index;