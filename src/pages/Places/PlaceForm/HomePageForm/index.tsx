import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Row, Col, Anchor } from 'antd';
import CategoryLinkItem from './CategoryLinkItem';
import NewCategoryItem from './NewCategoryItem';

import { updateHomeCategoryLinks } from 'api/api-place';

const { Link } = Anchor;

const { TabPane } = Tabs;


const index = ({placeDetail}:any) => {

    const [categoryLinkGroup, setCategoryLinkGroup] = useState<any[]>(placeDetail.data);
    const [loading, setLoading] = useState(false);

    const categoryLinkGroupRef = React.useRef<any>();
    const editedItemsRef = React.useRef<any>();

    const updatePlaceRef = (data:any) => {
        const arr:any = [];
        categoryLinkGroupRef.current = data;
        for (const index in categoryLinkGroupRef.current) {
            const element = categoryLinkGroupRef.current[index];
            for (const k in element.category_links) {
                const item = element.category_links[k];
                if(item.edited){
                    arr.push(item);
                }
            }
        }
        editedItemsRef.current = arr;
    };

    useEffect(()=>{
        updatePlaceRef(placeDetail.data);
    }, []);

    const onDeleteItem = (cid:number, id:number) => {
        for (const index in categoryLinkGroup) {
            const element = categoryLinkGroup[index];
            for (const k in element.category_links) {
                const item = element.category_links[k];
                if(item.id == id){
                    element.category_links.splice(k, 1);
                }
            }
        }
        updatePlaceRef([...categoryLinkGroup]);
    };

    const onAddedNewItem = (item:any) => {
        for (const index in categoryLinkGroup) {
            const element = categoryLinkGroup[index];
            if(item.category_id == element.id){
                element.category_links.push(item);
            }
        }
        sortCategoryLinks();
    };

    const handleClick = (
        e: React.MouseEvent<HTMLElement>,
        link: {
          title: React.ReactNode;
          href: string;
        },
    ) => {
        e.preventDefault();
    };

    const saveChanges = () => {
        console.log('editedItems ====>', editedItemsRef.current);
        if(editedItemsRef.current.length > 0){
            setLoading(true);
            updateHomeCategoryLinks({categories:editedItemsRef.current}).then((res:any)=>{
                editedItemsRef.current = [];
                setLoading(false);
                sortCategoryLinks();
            }).catch((err:any)=>{
                console.log('catch error ==>', err);
                setLoading(false);
            });
        }
    };

    const sortCategoryLinks = () => {
        for (const index in categoryLinkGroup) {
            const element = categoryLinkGroup[index];
            element.category_links.sort((a:any, b:any) => (a.order_number - b.order_number));
        }
        setCategoryLinkGroup([...categoryLinkGroup]);
        updatePlaceRef([...categoryLinkGroup]);
    };


    return (
        <>
        <Card title = "Home page" extra = {<Button type="primary" loading = {loading} onClick = {saveChanges}>Publish</Button>}>

            <NewCategoryItem categoryLinks = {categoryLinkGroup} onAddedNewItem = {onAddedNewItem} />
            
            <Tabs defaultActiveKey="0">
            {categoryLinkGroup.map((ele:any, index:number) => {
                const europeLinks = ele.category_links.filter((ele:any)=>ele.sub_page_id == 5);
                const soutchAmericaLinks = ele.category_links.filter((ele:any)=>ele.sub_page_id == 11);

                return (
                    <TabPane tab={ele.category_name} key={index}>
                        <Row gutter = {8}>
                            <Col span = {20}>
                                <div id ="europe-section">
                                    <h1 style = {{fontSize:16}}>Europe</h1>
                                    <Row gutter = {2}>
                                    {
                                        europeLinks.map((ele:any, i:number)=>(
                                            <Col md = {24} xs = {24}>
                                                <CategoryLinkItem 
                                                    key = {`${ele.id}-${Date.now()}`} data = {ele} onDeleteImage = {()=>{
                                                        ele.photo = null;
                                                        ele.photo_id = null;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }}
                                                    onChooseImage = {(photo:any)=>{
                                                        ele.edited = true;
                                                        ele.photo = photo;
                                                        ele.photo_id = photo.id;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }
                                                    } 
                                                    afterDelete = {(cid, id)=>{
                                                        onDeleteItem(cid, id);
                                                    }} 
                                                    onChange={(ndata:any)=>{
                                                        ele.title = ndata.title;
                                                        ele.sub_title = ndata.sub_title;
                                                        ele.link = ndata.link;
                                                        ele.edited = true;
                                                        ele.order_number = ndata.order_number;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }}
                                                />
                                            </Col>
                                        ))
                                    }
                                    </Row>
                                </div>
                                <div id ="south-america-section">
                                    <h1 style = {{fontSize:16, marginTop:32}}>South America</h1>
                                    <Row gutter = {2}>
                                    {
                                        soutchAmericaLinks.map((ele:any, i:number)=>(
                                            <Col md = {24} xs = {24}>
                                                <CategoryLinkItem 
                                                    key = {`${ele.id}-${Date.now()}`} data = {ele} onDeleteImage = {()=>{
                                                        ele.photo = null;
                                                        ele.photo_id = null;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }}
                                                    onChooseImage = {(photo:any)=>{
                                                        ele.edited = true;
                                                        ele.photo = photo;
                                                        ele.photo_id = photo.id;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }
                                                    } 
                                                    afterDelete = {(cid, id)=>{
                                                        onDeleteItem(cid, id);
                                                    }} 
                                                    onChange={(ndata:any)=>{
                                                        ele.title = ndata.title;
                                                        ele.sub_title = ndata.sub_title;
                                                        ele.link = ndata.link;
                                                        ele.edited = true;
                                                        ele.order_number = ndata.order_number;
                                                        updatePlaceRef([...categoryLinkGroup]);
                                                    }}
                                                />
                                            </Col>
                                        ))
                                    }
                                    </Row>

                                </div>
                            </Col>
                            <Col span = {4}>
                                <Anchor offsetTop = {80} onClick={handleClick}>
                                    <Link href="#europe-section" title="Europe" />
                                    <Link href="#south-america-section" title="South America" />
                                </Anchor>
                            </Col>
                        </Row>
                        

                    </TabPane>
                );
            }
            )}
            </Tabs>
        </Card>
        </>
    );
};

export default index;