/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request';
import moment from 'moment';


const GetAllReservations = (page, size, sort = true, fieldName = 'id', filter, homeOwner = false) => {
    if (!homeOwner) {
        return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&populate[villa][fields][1]=name&filters[$and][0][homeOwner][$eq]=false&filters[$and][1][reservation_infos][name][$containsi]=${filter}&populate[room][fields][1]=name`);
    } else {
        return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&populate[villa][fields][1]=name&populate[room][fields][1]=name`);
    }
}

const GetReservations = (page, size, sort = true, fieldName = 'id', filter, id, homeOwner = false) => {
    if (!homeOwner) {
        return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][villa][id][$eq]=${id}&filters[$and][1][homeOwner][$eq]=false&filters[$and][2][reservation_infos][name][$containsi]=${filter}`);
    } else {
        return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][villa][id][$eq]=${id}`);
    }
}

const GetReservationsTop5 = (id) => {
    return get(`/api/reservations?sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=5&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[homeOwner][$eq]=false&filters[villa][id][$eq]=${id}`);
}


const GetReservation = (id) =>
    get(
        //`/api/reservations/${id}?populate[0]=payments&populate[1]=villa&populate[reservations][populate][reservation_infos][filters][owner]=true`
        `/api/reservations/${id}?populate[0]=reservation_infos&populate[1]=reservation_items&populate[2]=villa&populate[3]=payments.payment_type&populate[4]=room.apart`

    );


const AddReservation = (payload) =>
    post(
        `/api/reservations`, payload, true
    );

// const AddReservationInfo = (payload) =>
//     post(
//         `/api/reservation-infos`, payload, true
//     );

const AddReservationItem = (payload) => {
    return post(`/api/reservation-items`, payload, true);
}

const GetAvailibleDate = (villaId) => {
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth().toString().length === 1 ? '0' + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString();
    let day = newDate.getDate().toString().length === 1 ? '0' + newDate.getDate().toString() : newDate.getDate().toString();

    return get(`/api/reservations?filters[$or][0][checkOut][$gte]=${year}-${month}-${day}&filters[$or][1][checkIn][$eq]=${year}-${month}-${day}&filters[reservationStatus][$ne]=110&filters[villa][id][$eq]=${villaId}&sort[0]=checkIn:asc&fields[0]=checkIn&fields[1]=checkOut&pagination[pageSize]=100&pagination[page]=1`)
}

const GetAvailibleDateRoom = (roomId) => {
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth().toString().length === 1 ? '0' + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString();
    let day = newDate.getDate().toString().length === 1 ? '0' + newDate.getDate().toString() : newDate.getDate().toString();

    return get(`/api/reservations?filters[$or][0][checkOut][$gte]=${year}-${month}-${day}&filters[$or][1][checkIn][$eq]=${year}-${month}-${day}&filters[reservationStatus][$ne]=110&filters[room][id][$eq]=${roomId}&sort[0]=checkIn:asc&fields[0]=checkIn&fields[1]=checkOut&pagination[pageSize]=100&pagination[page]=1`)
}

const UpdateReservation = (id, payload) =>
    put(
        `/api/reservations/${id}`, payload, true
    );

const ReservationRemove = (id) => remove('/api/reservations/' + id)

const GetNewReservations = () => {
    return get(`/api/reservations?sort[0]=createdAt:desc&populate[0]=reservation_infos&populate[1]=villa&populate[2]=room&filters[$or][0][reservationStatus][$eq]=100`);
}

const GetDailyReservationActions = () => {

    let separator = '-';
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let dateNow = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;

    //const query = `/api/reservations?populate[0]=reservation_infos&populate[1]=villa&filters[$and][0][$and][0][reservationStatus][$ne]=100&filters[$and][0][$and][1][reservationStatus][$ne]=110&filters[$and][0][$and][1][reservationStatus][$ne]=140&filters[$and][0][$and][1][homeOwner][$ne]=true&filters[$and][1][$or][0][checkIn][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&filters[$and][1][$or][1][checkOut][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&pagination[pageSize]=90&pagination[page]=1`;
    //const query = `/api/reservations?sort[0]=createdAt:asc&filters[$and][0][reservationStatus][$eq][0]=120&filters[$and][1][homeOwner][$eq]=false&filters[$and][2][$or][0][checkIn][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&filters[$and][2][$or][1][checkOut][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&populate[0]=reservation_infos&populate[1]=villa&pagination[pageSize]=10&pagination[page]=1&publicationState=live`;
    const query = `/api/reservations?sort[0]=checkIn:asc&filters[$and][0][$or][0][reservationStatus][$eq][0]=120&filters[$and][0][$or][1][$and][0][reservationStatus][$eq][0]=130&filters[$and][0][$or][1][$and][1][checkOut][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&filters[$and][1][homeOwner][$eq]=false&filters[$and][2][$or][0][checkIn][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&filters[$and][2][$or][1][checkOut][$eq]=${moment(dateNow).format('YYYY-MM-DD').toString()}&populate[0]=reservation_infos&populate[1]=villa&pagination[pageSize]=10&pagination[page]=1&publicationState=live`;

    return get(query);
}


export { GetReservations, GetReservation, AddReservation, AddReservationItem, GetAvailibleDate, GetReservationsTop5, GetAllReservations, UpdateReservation, ReservationRemove, GetNewReservations, GetDailyReservationActions, GetAvailibleDateRoom }
