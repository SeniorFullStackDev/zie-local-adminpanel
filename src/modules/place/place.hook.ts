import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as placeAction from './place.action';

const usePlace = () => {
	const dispatch = useDispatch();

	const place = useSelector((state: any) => {
		return state.placeReducer;
	});

	const setPlace = useCallback((payload:any) => {
		dispatch(placeAction.setPlace(payload));
	}, [dispatch]);

	return { place, setPlace };
};

export default usePlace;