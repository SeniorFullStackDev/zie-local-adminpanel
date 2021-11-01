export interface UserType {
	name: string;
	email: string;
	token?: string;
	role:string;
	google2fa_enabled?:string;
	qrcode?:any;
	require_2fa_step?:any;
}

export interface StateType {
	authReducer: any;
}

export interface ProductType {
	ID: number;
	title: string;
	status: string;
	name: string;
	sayduck_product_uuid: string;
	modifed: string;
	menu_order: number;
	description: string;
	portrait_thumb: string;
	landscape_thumb: string;
	base_price: number;
	width:number;
	height:number;
	depth:number;
	weight:number;
	resources:string;
	assigned?:boolean;
}

export interface ConsultantType {
	ID: number;
	name: string;
	password: string;
}

export interface TagType {
	ID:number,
	tag_type:string,
	tag_name:string
}

export interface PlaceType {
	title:string,
	content:string,
	place_parent:string,
	guid:string,
	search_label:string,
	longitude:string,
	latitude:string,
	bounds:string,
	second_page_content:string,
}