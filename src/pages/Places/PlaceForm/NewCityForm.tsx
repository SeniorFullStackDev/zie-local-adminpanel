import React, { useEffect, useState } from 'react';

import { getAllPlacesWithTitle, getAllContinents } from 'api/api-place';
import CityForm from './CityForm';
import CountryForm from './CountryForm';
import ChildPlaceForm from './ChildPlaceForm';
import HomePageForm from './HomePageForm';


export default () => {

    const [placeDetail, setPlaceDetail] = useState<any>({region:'', where_to_stay: [], external_links:[], id:0, city_contents:[], title:'Add New City' });
    const [allPlaces, setAllPlaces] = useState<any>([]);
    const [continents, setAllcontinents] = useState<any>([]);

    useEffect(()=>{
        getAllPlacesWithTitle(0).then(data=>{
            setAllPlaces(data.body);
        });
        getAllContinents().then(res=>{
            setAllcontinents(res.body);
        }).catch(error=>console.log);
    }, []);


    return (
        <CityForm  placeDetail = {placeDetail} allPlaces = {allPlaces} />
    );
};
