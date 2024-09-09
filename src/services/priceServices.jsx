/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'
import * as qs from 'qs'


const GetPrices = (villaId) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['checkIn', 'checkOut', 'price', 'id'],
        filters: {
            villa: {
                id: {
                    $eq: villaId
                }
            }
        }
    })
    return get(`/api/price-dates?${query}`);
}
const GetRoomPrices = (roomId) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['checkIn', 'checkOut', 'price', 'id'],
        filters: {
            room: {
                id: {
                    $eq: roomId
                }
            }
        }
    })
    return get(`/api/price-dates?${query}`);
}

const GetPriceForAddForm = (villaId, beginDate, finishDate) => {
    return get(`/api/price-dates?sort[0]=checkIn:asc&filters[$and][0][villa][id][$eq]=${villaId}&filters[$and][1][$or][0][$and][0][checkIn][$lte]=${beginDate}&filters[$and][1][$or][0][$and][1][checkOut][$gte]=${beginDate}&filters[$and][1][$or][1][$and][0][checkIn][$lte]=${finishDate}&filters[$and][1][$or][1][$and][1][checkOut][$gt]=${finishDate}&filters[$and][1][$or][2][$and][0][checkIn][$gt]=${beginDate}&filters[$and][1][$or][2][$and][1][checkOut][$lt]=${finishDate}&fields[0]=checkIn&fields[1]=checkOut&fields[2]=price&populate[villa][fields][0]=id&publicationState=live`);
}

const PriceRemove = (id) => remove('/api/price-dates/' + id)

const PricePut = (id, payload) => put(`/api/price-dates/${id}`, payload, true);
const PriceAdd = (payload) => post(`/api/price-dates`, payload, true);


export { GetPrices, GetPriceForAddForm, PriceRemove, PricePut,PriceAdd,GetRoomPrices }