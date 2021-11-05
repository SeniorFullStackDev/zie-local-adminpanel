import React , { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { DeleteFilled, EditFilled, CloseOutlined } from '@ant-design/icons';
import { PATHS } from 'constants/routes';

const { Option } = Select;


interface Props {
	id?:string;
    countryId:any;
    cities:any;
}

const Index = ({id, cities}: Props) => {

    const [cityList, setCityList] = useState(cities);
    const [isEdited, setEdited] = useState(false);


    const onChangeChildPlace = (val:any, index:number) => {
        cities[index].sub_place_id = val;
        setCityList([...cities]);
        setEdited(true);
    };

    const addMoreChildPlace = () => {
        // const newCity = {
        //     sub_place_id:'',
        // };
        // setChildrenPlaces([...childrenPlaces, newCity]);
    };

    const removeCity = (index:number) => {
        // childrenPlaces.splice(index, 1);
        // setChildrenPlaces([...childrenPlaces]);
    };


    return (
        <Card id = {id} title = "Cities">
            Places:
            {
                cityList.map((child:any, index:number)=>(
                    <Form.Item key={index}>
                        <div className = "cityRow">
                            <span>{index+1}.&ensp;</span>
                            <div>
                                <a href ={`${PATHS.DASHBOARD}${PATHS.PLACES}/${child.id}`}>{child.title}</a>
                            </div>
                        </div>
                    </Form.Item>
                ))
            }
            {/* <Form.Item>
                <Button color="primary" onClick = {addMoreChildPlace}>Add Row</Button>
            </Form.Item> */}
        </Card>
    );
};

export default Index;