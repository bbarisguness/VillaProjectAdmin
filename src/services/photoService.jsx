/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request'
import * as qs from 'qs'

const Upload = (payload) => post(`/api/upload`, payload, true, true)

const GetPhotos = (villaId) => {
    const query = qs.stringify({
        sort: ['line:asc'],
        fields: ['line'],
        populate: ['photo'],
        filters: {
            villa: {
                id: {
                    $eq: villaId
                }
            }
        },
        pagination: {
            pageSize: 100,
            page: 1,
        },
        publicationState: 'live',
    });
    return get(`/api/photos?${query}`);
}

const GetPhotosApart = (apartId) => {
    const query = qs.stringify({
        sort: ['line:asc'],
        fields: ['line'],
        populate: ['photo'],
        filters: {
            apart: {
                id: {
                    $eq: apartId
                }
            }
        },
        pagination: {
            pageSize: 100,
            page: 1,
        },
        publicationState: 'live',
    });
    return get(`/api/photos?${query}`);
}

const GetPhotosRoom = (roomId) => {
    const query = qs.stringify({
        sort: ['line:asc'],
        fields: ['line'],
        populate: ['photo'],
        filters: {
            room: {
                id: {
                    $eq: roomId
                }
            }
        },
        pagination: {
            pageSize: 100,
            page: 1,
        },
        publicationState: 'live',
    });
    return get(`/api/photos?${query}`);
}

const PhotoPut = (id, payload) => put(`/api/photos/${id}`, payload, true);
const PhotoPost = (payload) => post(`/api/photos`, payload, true);

const PhotoRemove = (id) => remove('/api/photos/' + id)
const PhotoRemoveHard = (id) => remove('/api/upload/files/' + id)

//--- /api/upload/files/:id	


export { GetPhotos, PhotoPut, PhotoPost, Upload, PhotoRemove, PhotoRemoveHard, GetPhotosApart, GetPhotosRoom }