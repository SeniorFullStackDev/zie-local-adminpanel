import { createAction } from 'redux-act';

export const setPhotos: any = createAction('setPhotos', (photos:any[]) => ({ photos }));
export const setPaginationOption: any = createAction('setPaginationOption', (paginationOption:any) => ({ paginationOption }));
