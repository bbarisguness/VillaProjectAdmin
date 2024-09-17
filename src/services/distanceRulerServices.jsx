/* eslint-disable prettier/prettier */
import { get, post, remove } from './request'
import * as qs from 'qs'

const DistanceRulerAdd = (payload) => post('/DistanceRulers/Create', payload, true, true)

const DistanceRulerRemove = (id) => get(`/DistanceRulers/DeleteHard/${id}`, true)

const DistanceRulerUpdateDetail = (payload) => post('/DistanceRulers/UpdateDetail', payload, true, true)

const DistanceRulerCreateDetail = (payload) => post('/DistanceRulers/CreateDetail', payload, true, true)

const GetDistanceRuler = (id) => {
    return get(`/DistanceRulers/GetAll?VillaId=${id}`, true);
}

const GetDistanceRulerApart = (id) => {
    return get(`/DistanceRulers/GetAll?HotelId=${id}`, true);
}


export { DistanceRulerAdd, DistanceRulerRemove, GetDistanceRuler, GetDistanceRulerApart, DistanceRulerUpdateDetail, DistanceRulerCreateDetail }