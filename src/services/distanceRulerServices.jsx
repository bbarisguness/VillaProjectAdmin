/* eslint-disable prettier/prettier */
import { get, post, remove } from './request'
import * as qs from 'qs'

const DistanceRulerAdd = (payload) => post('/api/distance-rulers', payload, true)

const DistanceRulerRemove = (id) => remove('/api/distance-rulers/' + id)



export { DistanceRulerAdd,DistanceRulerRemove }