/* eslint-disable prettier/prettier */
import { get, post, remove, put } from './request';
import * as qs from 'qs'


const GetAllPaymentsByReservation = (reservationId) => {
    const query = qs.stringify({
        populate: ['villa', 'room.apart', 'payments', 'payments.payment_type'],
        // populate: {
        //     price_tables: {
        //         fields: ['id', 'name', 'value']
        //     }
        // }        
    });
    return get(`/api/reservations/${reservationId}?${query}`);
    //return get(`/api/reservations/${reservationId}?populate[villa][fields][0]=id&populate[villa][fields][1]=name&populate[room][fields][1]=name&populate[room][fields][1]=name&populate[payments][fields][0]=amount&populate[payments][fields][1]=id&populate[payments][fields][2]=description&populate[payments][fields][3]=createdAt&populate[payments][populate][0]=payment_type&pagination[pageSize]=10&pagination[page]=1`);
}

const GetPayment = (id) => {
    return get(`/api/payments/${id}?populate=payment_type`);
}

const UpdatePayment = ({ id, data }) => {
    return put(`/api/payments/${id}`, data, true)
}


const AddPayment = (payload) =>
    post(
        `/api/payments`, payload, true
    );

const PaymentRemove = (id) => remove('/api/payments/' + id)


export { GetAllPaymentsByReservation, AddPayment, PaymentRemove, GetPayment, UpdatePayment }