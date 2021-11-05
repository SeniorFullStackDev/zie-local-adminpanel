import React, { useEffect, useState } from 'react';

import { getAllPlacesWithTitle, getAllContinents } from 'api/api-place';
import CityForm from './CityForm';
import CountryForm from './CountryForm';
import ChildPlaceForm from './ChildPlaceForm';
import HomePageForm from './HomePageForm';


export default () => {

    const [placeDetail, setPlaceDetail] = useState<any>({region:'', where_to_stay: [], external_links:[], id:0, category_pages:[], title:'Add New Country' });
    const [continents, setAllcontinents] = useState<any>([]);

    useEffect(()=>{
        getAllContinents().then(res=>{
            setAllcontinents(res.body);
        }).catch(error=>console.log);
    }, []);


    return (
        <CountryForm  placeDetail = {placeDetail} continents = {continents} />
    );
};
