

import React, { useRef, useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Image, Upload, Row, Col, Select } from 'antd';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DeleteFilled, DownOutlined, EditFilled, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const index = ({title, children}:any) => {

    const [toggle, toggleCard] = useState(true);

    return (
        <Card title = {title} extra = {(<Button style = {{border:'none'}}  shape = "circle" onClick = {()=>toggleCard(!toggle)}>{toggle && <CaretUpOutlined />}{!toggle && <CaretDownOutlined />}</Button>)} bodyStyle = {{padding:0}}>
            {toggle && 
                <div style = {{padding:24}}>
                    {children}
                </div>
            }
        </Card>
    );
};

export default index; 