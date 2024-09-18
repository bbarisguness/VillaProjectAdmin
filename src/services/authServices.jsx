/* eslint-disable prettier/prettier */
import { get, post, put, remove } from './request'

const LoginService = (payload) => post(`/Auth/Login`, payload, true, true);

export { LoginService }