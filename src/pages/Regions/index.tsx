import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Table, Tag, Space, Button, Modal, Form, Input, Badge, Card, Row, Col, InputNumber } from 'antd';
import { getAllRegions,createRegion, deleteRegion, updateRegion } from 'api/api-region';
import {DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined} from '@ant-design/icons';

import history from 'modules/history';

interface Item {
    id: string;
    source_url: string;
    taret_url: number;
  }


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
  }
  
const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };



const ActionCell = ({ item, editingId, onChange, onEditing, form }: any) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const onDeleteBtn = () => {
		setIsRequesting(true);
		deleteRegion(item.id).then((res:any)=>{
        setIsRequesting(false);
        onChange();
    }).catch((err:any)=>{
        setIsRequesting(false);
    });
	};

    const onClickEditBtn = () => {
        onEditing(item.id);
        form.setFieldsValue(item);1;
    };

    const onSave = () => {
        setIsRequesting(true);
        updateRegion(item.id, form.getFieldsValue()).then(res=>{
            setIsRequesting(false);
            onEditing('');
        }).catch(err=>{
            console.log(err);
            setIsRequesting(false);
            onEditing('');
        });
    };

    const onCancel = () => {
        onEditing('');
    };

    if(editingId == item.id){
        return (
            <Space size="middle">
                <Button loading={isRequesting} icon={<CheckCircleOutlined />} onClick={onSave} />
                <Button loading={isRequesting} icon={<CloseCircleOutlined/>} onClick={onCancel} />
            </Space>
        );    
    }

	return (
		<Space size="middle">
            <Button loading={isRequesting} icon={<EditOutlined />} onClick={onClickEditBtn} />
			<Button loading={isRequesting} icon={<DeleteOutlined/>} onClick={onDeleteBtn} />
		</Space>
	);
};



const Index = ({ match }: any) => {

    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [editingId, setEditingId] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const columns = [
		{
			title: 'Region Title',
			dataIndex: 'region_title',
            editable:true
		},
		{
			title: 'Region Name',
			dataIndex: 'region_name',
            editable:true
		},
		{
			title: 'Bounds',
			dataIndex: 'bounds',
            editable:true
		},
		{
			title: '',
			key: 'action',
			width: '20%',
			render: (text: string, record: any) => (
				<ActionCell 
              form = {form}
              item={record} 
              editingId = {editingId}  
              onChange={() => loadTable()} 
              onEditing = {(val:string)=>{
                console.log('val ===>', val);
                  setEditingId(val);
              }}
              
          />
			),
		},
	];

	const [tableData, setTableData] = useState<Item[]>([]);
	const [tablePaginationOption, setTablePaginationOption] = useState<{total:number, curPage:number, pageSize:number}>({total:0, curPage:1, pageSize:10});

	useEffect(()=>{
		loadTable();
	}, [tablePaginationOption.curPage]);

  const loadTable = async (query='')=>{
		const {pageSize, curPage} = tablePaginationOption;
		const { body } = await getAllRegions(pageSize * (curPage - 1), pageSize, query);
		setTableData(body.data);
		setTablePaginationOption({curPage, pageSize, total:body.total});
	};

	const onChange = (pagination:any, filters:any, sorter:any, extra:any) => {
		setTablePaginationOption({...tablePaginationOption, curPage: pagination.current});
	};

	const onCreateNewRedirection = () => {
		history.push(`${match.path}/0`);
	};

	const {pageSize, curPage, total} = tablePaginationOption;

	const onFinishSearch = (e:any) => {
		loadTable(e.target.value);
	};

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: (record.id == editingId),
          }),
        };
    });

    const handleOk = () => {
        setIsRequesting(true);
        createRegion(createForm.getFieldsValue()).then(res=>{
            setIsRequesting(false);
            loadTable();
            setModalVisible(false);
            createForm.resetFields();
        }).catch(err=>{
            setIsRequesting(false);
        });
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

    return (
        <>
            <Card title = "Regions" actions = {[<div style = {{display:'flex'}}><Button type="primary" style = {{marginRight:24, marginLeft:'auto'}} onClick = {()=>{
                setModalVisible(true);
            }}>Add more</Button></div>]}>

              <div className ="table-header">
                <Input.Search style={{ width: '40%' }} onPressEnter = {onFinishSearch}/>
              </div>
                <Form form={form} component={false}>
                    <Table 
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns}
                        dataSource={tableData} 
                        onChange = {onChange}  
                        pagination={{ defaultPageSize: pageSize, showSizeChanger: false, total}}
                    />
                </Form>
            </Card>

            <Modal
				title="New"
				visible={isModalVisible}
				onOk={handleOk}
                onCancel={handleCancel}
				footer={[
					<Button key="submit" type="primary" loading={isRequesting} onClick={handleOk}>
						Ok
					</Button>,
				]}
			>
				<Form form={createForm} {...layout}>
          <Form.Item
						label="Region Name"
						name="region_name"
						tooltip={{ title: 'Region Name', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'required!' }]}
					>
						<Input />
					</Form.Item>

          <Form.Item
						label="Region Title"
						name="region_title"
						tooltip={{ title: 'Region Title', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'required!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Bounds"
						name="bounds"
						tooltip={{ title: 'Bounds', icon: <InfoCircleOutlined /> }}
						required
						rules={[{ required: true, message: 'required!' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
        </>
    );
};

export default Index;