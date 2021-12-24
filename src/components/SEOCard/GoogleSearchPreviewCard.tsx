import React, { useState } from 'react';
import { Radio, Card, Typography, Space } from 'antd';
import MetadataGenerator from 'utils/metatag-generator';

interface Props {
    placeDetail:any
}

const index = ({ placeDetail }:Props) => {

    const [previewOption, setPreviewOption] = useState('mobile');

    if(!placeDetail.seo){
        return null;
    }

    const logoImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC5ElEQVR4AWLABhiBEEJDAKBrcgCyYwsCaLDGt1n8to1SbNu2bdu2baxt2zbqrT3ok8lsXFNzfdqN0Bb4SxV9XYuubtZ0rbsgVo9fPwci0lYQR+Az4EvgVQOcfyjTV/3Ldz0/31vGEr8zYmmsuQli/7wm5CfgiuhaVUtYqNYcGKhpxSWN5wtCVadbk+gdvJfpQcd5ddcghtzeii76rEcgbUFmF9VZmmaEnGJXhgcVU6dQ8sN3VMyeSZ+QvfzltwFV1xGBlYEXeHnnQLKrS1weCxiTXJ6rfXpkIvbHh/GF+zKq3e5T/ON3WMaPY3TEcX7zWYeiaYCwxP90q4CqsjuGz7xT01Rf8ePxGdht64OdIcDx5kRcciMo7dKJ4r//5EyCGw7GWSefLYy4t8OEx7rs1ls0fWgbYMGhqPsG3Bu7rQ8FDDUf9w7ZR83+vZQYVmTevcqrd6Zif3K4+a7jlZVUNNYeFpH2bYzBvfOlVa3ajd/xxAj+8d3I0PAjWHIyqJgzm4b7d/nfdzN2B4fw17kFWBqqKxEczfArupr85ZHJBtyX30/NwSU7Eu/CGrbElbE5rpTNsaXsSyxnbcpdvjkzk9s5BdQ0a82AsylARY8YeH0TF+JcKU46THnIKDzyy/nwXCJvnUngbeN//2w8boW5uOTl8PONVGoVvQ4Ru8cZOFlT6EnSle8IO2BF3mVrtPQ5bI8v5R1TQLwpZF1MCXEVjQzxzEZDohHamQUEdKnKu6WHHbIhbL81uRetULxsaS46yTDvPN56JOBdYx7lm0dNiw7I4idlDFiJKN4ZniMMAVbkXrJC9bJGDXifgIJiE3zsyiCvHBRdcgRef7GEP9aVuqxM77HkX7ZF9bQ2fhuaSq7z8/U03j2bwLiAXKoVvQrk78etZvxPxQAfIPodtSJI09KmokT+g5azijt51QSW1IkmRAj80IoZn4k9J8PsxHbG/xuwHuQqot0Adgh0Amye7dvH5j8A3JByU5M032sAAAAASUVORK5CYII=';

    const getGuidStr =  () => {
        return placeDetail.guid.split('/').filter((ele:any)=>(ele != '')).join(' › ');
    };
    return (
        <>
            <Typography.Title level = {4}>Preview</Typography.Title>

            <Radio.Group onChange={(e)=>{setPreviewOption(e.target.value);}} value={previewOption}>
                <Radio value="mobile">Mobile Preview</Radio>
                <Radio value="desktop">Desktop Preview</Radio>
            </Radio.Group>
            {
                previewOption == 'mobile' && 
                <Card style = {{marginTop:8, width: 400}}>
                    <Space align="center" size = {[0, 0]}><span style = {{marginRight:12,display:'grid'}}><img style = {{width:16, height:16}} src = {logoImage} /></span>https://zielonamapa.pl{getGuidStr()}</Space>
                    <Typography.Title level = {3} style = {{color:'#1a0dab', cursor:'pointer'}}>
                    {placeDetail.seo.schema_json.title}
                    </Typography.Title>
                    <div style = {{display:'flex'}}>
                        <div style = {{flexGrow:1}}>
                            <Typography.Text>
                                {placeDetail.seo.schema_json.description}
                            </Typography.Text>
                            <div style = {{color:'#70757a', lineHeight:1.58}}>
                                <span className = "g-rating-bar">
                                    <span className = "g-rating-star" style = {{width:'80%'}}></span>
                                </span>
                                <span>{placeDetail.rating.ratingValue.toFixed(2)}&lrm; ({placeDetail.rating.reviewCount})</span>
                            </div>
                        </div>
                        <div>
                            {placeDetail.thumbnail && <img src = {placeDetail.thumbnail.sizes.thumbnail} style = {{width:104, height:104, borderRadius:8}}/>}
                        </div>
                    </div>
                </Card>
            }
            {
                previewOption == 'desktop' && 
                <Card style = {{marginTop:8}}>
                    <div>https://zielonamapa.pl{getGuidStr()}</div>
                    <Typography.Title level = {3} style = {{color:'#1a0dab', cursor:'pointer'}}>
                    {placeDetail.seo.schema_json.title}
                    </Typography.Title>
                    <Typography.Text>
                        {placeDetail.seo.schema_json.description}
                    </Typography.Text>
                    <div style = {{color:'#70757a', lineHeight:1.58}}>
                        <span className = "g-rating-bar">
                            <span className = "g-rating-star" style = {{width:'80%'}}></span>
                        </span>
                        <span>Rating: {placeDetail.rating.ratingValue.toFixed(2)}  · &lrm; {placeDetail.rating.reviewCount} votes</span>
                    </div>
                </Card>
            }
        </>
    );
};

export default index;