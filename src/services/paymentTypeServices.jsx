/* eslint-disable prettier/prettier */
import { get } from './request';


const GetAllPaymentTypes = () => {

    return get(`/PaymentTypes/GetAll`, true);

}



export { GetAllPaymentTypes }