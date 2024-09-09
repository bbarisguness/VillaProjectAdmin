/* eslint-disable prettier/prettier */
import { get } from './request';


const GetAllPaymentTypes = () => {

    return get(`/api/payment-types?sort=id:asc&pagination[page]=1&pagination[pageSize]=100&publicationState=live`);

}



export { GetAllPaymentTypes }