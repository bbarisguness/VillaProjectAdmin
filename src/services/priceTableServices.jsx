/* eslint-disable prettier/prettier */
import { get, post, remove } from './request'
import * as qs from 'qs'

const PriceTableAdd = (payload) => post('/api/price-tables', payload, true)

const PriceTableRemove = (id) => remove('/api/price-tables/' + id)



export { PriceTableAdd,PriceTableRemove }