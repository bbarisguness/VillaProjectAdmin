import { get, post, remove } from './request'

export const Categories = () => get(`/Categories/GetAll`, true)

export const CreateCategory = (payload) => post(`/Categories/Create`, payload, true, true)

export const UpdateCategoryDetail = (payload) => post(`/Categories/UpdateDetail`, payload, true, true)

export const CreateCategoryDetail = (payload) => post(`/Categories/CreateDetail`, payload, true, true)