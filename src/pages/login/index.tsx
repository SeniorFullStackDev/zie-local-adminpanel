import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Card, notification } from 'antd';
import { useLocation } from 'react-router-dom';
import useAuth from 'modules/auth/auth.hook';
import classes from './style.module.scss';
import history from 'modules/history';
import { PATHS } from 'constants/routes';
import { resetpassword } from 'api/api-auth';


const LoginPage = () => {
	const { profile, onSignin, verify2FA } = useAuth();
	const [loading, setLoading] = useState(false);

	const query = new URLSearchParams(useLocation().search);

	const [visibleResetPasswordForm, setVisibleResetpasswordForm] = useState(false);

	useEffect(()=>{
		if(query.get('reset_password_token')){
			console.log('reset_password_token ==>', query.get('reset_password_token'));
			console.log('email ==>', query.get('email'));
			setVisibleResetpasswordForm(true);
		}
	}, [query]);

	const onFinish = (values: any) => {
		onSignin(values);
	};	

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const QRCode = (qrcode:string) => {
		if(qrcode.includes('<?xml')){
			return <div dangerouslySetInnerHTML = {{__html: qrcode}} />;
		}else{
			return <img src={qrcode} />;
		}
	};

	const onFinishQRCodeForm = (values:any) => {
		values.email = profile.email;
		verify2FA(values);
	};

	const onFinishResetForm = (values:any) => {
		values.token = query.get('reset_password_token');
		values.email = query.get('email');
		resetpassword(values).then((res:any)=>{
			notification.open({
				message: 'Message',
				description:'Your Password is updated successfully',
				onClick: () => {
					console.log('Notification Clicked!');
				},
			});
			history.push(PATHS.LOGIN);
			setVisibleResetpasswordForm(false);
		}).catch((err:any)=>{
			console.log('err ==>', err);
		});
	};

	if(visibleResetPasswordForm){
		return (
			<div className={classes.container}>
				<Form onFinish = {onFinishResetForm} onFinishFailed={onFinishFailed} >
					<Card title = "Reset password" style={{ width: 500 }}>
						<Form.Item
							name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							name="password_confirmation"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" loading = {loading}>
								Reset Password
							</Button>
						</Form.Item>
					</Card>
				</Form>
			</div>
		);
	}

	return (
		<div className={classes.container}>
			{!profile.require_2fa_step &&
			<Form initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
				<Card title="Admin Login" style={{ width: 500 }}>
					<Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item name="remember" valuePropName="checked">
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Login
						</Button>
					</Form.Item>
				</Card>
			</Form>
			}
			{profile.require_2fa_step && 
				<Form onFinish={onFinishQRCodeForm} onFinishFailed={onFinishFailed}>
					<Card title="2FA" style={{ width: 500 }}>
						<Form.Item name="code" rules={[{ required: true, message: 'code is required' }]}>
							<Input />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Confirm
							</Button>
						</Form.Item>
						{/* {QRCode(profile.qrcode)} */}
					</Card>
				</Form>
			}
		</div>
	);
};

export default LoginPage;
