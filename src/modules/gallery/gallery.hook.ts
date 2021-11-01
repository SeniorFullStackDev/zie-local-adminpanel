import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as galleryAction from './gallery.action';

const useGallery = () => {
	const dispatch = useDispatch();

	const gallery = useSelector((state:any) => {
		return state.galleryReducer;
	});

	const setPhotos = useCallback(
		(paload) => {
			dispatch(galleryAction.setPhotos(paload));
		},
		[dispatch],
	);

	const setPaginationOption = useCallback(
		(paload) => {
			dispatch(galleryAction.setPaginationOption(paload));
		},
		[dispatch],
	);

	return { gallery,setPhotos, setPaginationOption };
};

export default useGallery;