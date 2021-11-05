import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { PATHS } from 'constants/routes';
import { Layout, Menu, Breadcrumb, Dropdown, Button } from 'antd';
import { CommentOutlined, EnvironmentOutlined, UserOutlined, LaptopOutlined, LogoutOutlined, TagsOutlined, FolderOpenOutlined} from '@ant-design/icons';
import AllPlaces from 'pages/Places';
import PlaceForm from 'pages/Places/PlaceForm';
import NewCityForm from 'pages/Places/PlaceForm/NewCityForm';
import NewCountryFrom from 'pages/Places/PlaceForm/NewCountryForm';

import AllUsers from 'pages/Users';
import AllAdmins from 'pages/Admins';

import AllComments from 'pages/Comments';

import history from 'modules/history';
import useAuth from 'modules/auth/auth.hook';

import CommentForm from './CommentForm';
import AdminForm from 'pages/Admins/AdminForm';
import AllPhotos from 'pages/Photos';
import AllRedirections from 'pages/Redirections';
import AllRegions from 'pages/Regions';
import UserForm from 'pages/Users/UserForm';
import CreateUserForm from 'pages/Users/CreateUserForm';
import AllSeos from 'pages/Seo';

const { SubMenu } = Menu;

const { Header, Content, Sider, Footer } = Layout;

const Dashboard = ({ match, location }: any) => {

	let openMenuItem = '0';
	if (location.pathname.includes(PATHS.PLACES)) openMenuItem = '0';
	if (location.pathname.includes(PATHS.COMMENTS)) openMenuItem = '1';
	if (location.pathname.includes(PATHS.USERS)) openMenuItem = '2';
	if (location.pathname.includes(PATHS.ADMINS)) openMenuItem = '3';
	if (location.pathname.includes(PATHS.Regions)) openMenuItem = '4';
	if (location.pathname.includes(PATHS.PHOTOS)) openMenuItem = '5';
	if (location.pathname.includes(PATHS.REDIRECTIONS)) openMenuItem = '6';
	if (location.pathname.includes(PATHS.SEO)) openMenuItem = '7';
	if (location.pathname.includes(PATHS.TRANSLATION)) openMenuItem = '8';

	const { profile, onSignOut } = useAuth();

	console.log('profile ===>', profile);

	const [breadcrumbs, setBreadcrumbs] = useState<string[]>([
		PATHS.DASHBOARD,
		PATHS.USER_MANAGEMENT,
	]);

	const linkTo = (paths: string[]) => {
		history.push(paths.join(''));
		setBreadcrumbs(paths);
	};

	const onClickLogoutBtn = () => {
		onSignOut();
		history.push(PATHS.LOGIN);
	};

	return (
		<Layout>
			<Header className='header'>
				<div className="logo">
					<a href="https://www.zielonamapa.pl">
						<img src="https://www.zielonamapa.pl/asset/icon/graphics-logo-full-white.svg" width = "176" />
					</a>
				</div>
				<Button ghost icon = {<img src="/images/icons-logout.svg" />} style={{border:'none'}} onClick = {onClickLogoutBtn}><span style={{marginLeft:8}}>Log out</span></Button>
			</Header>
			<Layout>
				<Sider className='sider'>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={[openMenuItem]}>
						<Menu.Item
							key="0"
							icon={<span><img src = "/images/icons-places.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.PLACES]);
							}}
						>
							Places
						</Menu.Item>
						<Menu.Item
							key="1"
							icon={<span><img src = "/images/icons-reviews.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.COMMENTS]);
							}}
						>
							Comments
						</Menu.Item>

						<Menu.Item
							key="2"
							icon={<span><img src = "/images/icons-user.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.USERS]);
							}}
						>
							Users
						</Menu.Item>

						{profile.role == 'administrator' && <Menu.Item
							key="3"
							icon={<span><img src = "/images/icons-admin.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.ADMINS]);
							}}
						>
							Admin
						</Menu.Item>
						}
						<Menu.Item
							key="4"
							icon={<span><img src = "/images/icons-region.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.REGIONS]);
							}}
						>
							Regions
						</Menu.Item>

						<Menu.Item
							key="5"
							icon={<span><img src = "/images/icons-media.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.PHOTOS]);
							}}
						>
							Photos
						</Menu.Item>

						<Menu.Item
							key="6"
							icon={<span><img src = "/images/icons-redirection.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.REDIRECTIONS]);
							}}
						>
							Redirections
						</Menu.Item>

						<Menu.Item
							key="7"
							icon={<span><img src = "/images/icons-seo.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.SEO]);
							}}
						>
							SEO
						</Menu.Item>

						<Menu.Item
							key="8"
							icon={<span><img src = "/images/icons-translation.svg" /></span>}
							onClick={() => {
								linkTo([match.path, PATHS.TRANSLATION]);
							}}
						>
							Translation
						</Menu.Item>


					</Menu>
				</Sider>
				<Layout style={{ padding: '0px', marginLeft: 200 }}>
					<Breadcrumb style={{ margin: '16px 0', textTransform: 'capitalize' }}>
						{breadcrumbs.map((e, i) => (
							<Breadcrumb.Item key={i}>{e.replace('/', '')}</Breadcrumb.Item>
						))}
					</Breadcrumb>
					<Content style = {{padding: 24, margin: 0, minHeight:500}}>
						<Route
							exact
							path={`${match.path}${PATHS.PLACES}`}
							component={AllPlaces}
						/>
						<Route
							exact
							path={`${match.path}${PATHS.PLACES}/:placeId`}
							component={PlaceForm}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.PLACES}/city/new`}
							component={NewCityForm}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.PLACES}/country/new`}
							component={NewCountryFrom}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.COMMENTS}`}
							component={AllComments}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.COMMENTS}/:commentId`}
							component={CommentForm}
						/>
						

						<Route
							exact
							path={`${match.path}${PATHS.USERS}/:userId`}
							component={UserForm}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.USERS}/create`}
							component={CreateUserForm}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.USERS}`}
							component={AllUsers}
						/>

						{
							profile.role == 'administrator' && (
								<>
										<Route
											exact
											path={`${match.path}${PATHS.ADMINS}`}
											component={AllAdmins}
										/>

										<Route
											exact
											path={`${match.path}${PATHS.ADMINS}/:adminId`}
											component={AdminForm}
										/>
								</>
							)
						}

						<Route
							exact
							path={`${match.path}${PATHS.PHOTOS}`}
							component={AllPhotos}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.REDIRECTIONS}`}
							component={AllRedirections}
						/>

						<Route
							exact
							path={`${match.path}${PATHS.REGIONS}`}
							component={AllRegions}
						/>

						
						<Route
							exact
							path={`${match.path}${PATHS.SEO}`}
							component={AllSeos}
						/>

					</Content>
					<Footer style={{ textAlign: 'center' }}>Zielonamapa ©2021</Footer>
				</Layout>
			</Layout>
		</Layout>
	);
};
export default Dashboard;