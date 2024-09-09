/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'
import * as qs from 'qs'

const GetRoom = (id) => get(`/api/rooms/${id}?populate[photos][sort]=line:asc&populate[photos][populate][0]=photo&populate[reservations][populate][reservation_infos][filters][owner][$eq]=true&populate[reservations][sort][0]=createdAt:desc`)
const AddRoom = (payload) => post(`/api/rooms`, payload, true);

const GetRoomName = (id) => get(`/api/rooms/${id}?fields=name&populate[apart][fields][0]=name&populate[apart][fields][1]=id`)

const GetRoomList = (apartId) => {
    const query = qs.stringify({
        //sort: ['checkIn:asc'],
        //fields: ['id'],
        // populate: {
        //     villa: {
        //         fields: ['id', 'name']
        //     }
        // },
        filters: {
            apart: {
                id: {
                    $eq: apartId
                }
            }
        }
    })
    return get(`/api/rooms?${query}`);
}


const GetReservationListTop5 = (roomId) => {
    const query = qs.stringify({
        populate: ['reservation_infos'],
        sort: ['checkIn:asc'],
        //fields: ['id'],
        // populate: {
        //     villa: {
        //         fields: ['id', 'name']
        //     }
        // },
        filters: {
            room: {
                id: {
                    $eq: roomId
                }
            },
            homeOwner: {
                $eq: false
            }
        }
    })
    return get(`/api/reservations?${query}`);
}


// const GetReservations = (page, size, sort = true, fieldName = 'id', filter, id, homeOwner = false) => {
//     if (!homeOwner) {
//         return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][room][id][$eq]=${id}&filters[$and][1][homeOwner][$eq]=false&filters[$and][2][reservation_infos][name][$containsi]=${filter}`);
//     } else {
//         return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][room][id][$eq]=${id}`);
//     }
// }
const RoomChangeState = (id, payload) => put(`/api/rooms/${id}`, payload, true);

const GetReservations = (page, size, sort = true, fieldName = 'id', filter, roomId, homeOwner = false) => {
    if (!homeOwner) {
        const query = qs.stringify({
            populate: ['reservation_infos'],
            sort: ['checkIn:asc'],
            //fields: ['id'],
            // populate: {
            //     villa: {
            //         fields: ['id', 'name']
            //     }
            // },
            filters: {
                room: {
                    id: {
                        $eq: roomId
                    }
                },
                homeOwner: {
                    $eq: false
                }
            }
        })
        return get(`/api/reservations?${query}`);
    } else {
        //         const query = qs.stringify({
        //             populate: ['reservation_infos'],
        //             sort: ['checkIn:asc'],
        //             //fields: ['id'],
        //             // populate: {
        //             //     villa: {
        //             //         fields: ['id', 'name']
        //             //     }
        //             // },
        //             filters: {
        //                 room: {
        //                     id: {
        //                         $eq: roomId
        //                     }
        //                 }
        //             }
        //         })
        // return get(`/api/reservations?${query}`);
        return get(`/api/reservations?sort=${fieldName}:${sort ? 'desc' : 'asc'}&pagination[page]=${page}&pagination[pageSize]=${size}&populate[reservation_infos][fields][0]=name&populate[reservation_infos][fields][1]=surname&filters[$and][0][room][id][$eq]=${roomId}`);
    }
}


const RoomIsAvailible = (roomId, date1, date2) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['id'],
        populate: {
            room: {
                fields: ['id', 'name']
            }
        },
        filters: {
            $and: [
                {
                    room: {
                        id: {
                            $eq: roomId
                        }
                    }
                },
                {
                    reservationStatus: {
                        $ne: 110
                    }
                },
                {
                    $or: [
                        {
                            $and: [
                                { checkIn: { $gt: date1 } },
                                { checkIn: { $lt: date2 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lte: date1 } },
                                { checkOut: { $gt: date1 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lt: date2 } },
                                { checkOut: { $gte: date2 } }
                            ]
                        }
                    ]
                }
            ]
        }
    })
    return get(`/api/reservations?${query}`);
}

const RoomGetPriceForReservation = (roomId, date1, date2) => {
    const query = qs.stringify({
        sort: ['checkIn:asc'],
        fields: ['checkIn', 'checkOut', 'price'],
        populate: {
            room: {
                fields: ['id', 'name']
            }
        },
        filters: {
            $and: [
                {
                    room: {
                        id: {
                            $eq: roomId
                        }
                    }
                },
                {
                    $or: [
                        {
                            $and: [
                                { checkIn: { $gt: date1 } },
                                { checkIn: { $lte: date2 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lte: date1 } },
                                { checkOut: { $gte: date1 } }
                            ]
                        },
                        {
                            $and: [
                                { checkIn: { $lte: date2 } },
                                { checkOut: { $gte: date2 } }
                            ]
                        }
                    ]
                }
            ]
        }
    });
    return get(`/api/price-dates?${query}`);
}

export { GetRoom, GetRoomList, GetReservations, GetReservationListTop5, RoomChangeState, AddRoom, RoomIsAvailible, RoomGetPriceForReservation, GetRoomName }