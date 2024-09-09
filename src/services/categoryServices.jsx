import { get, post, remove } from './request'

export const Categories = () => get(`/api/categories?sort=name:asc&pagination[page]=1&pagination[pageSize]=100&publicationState=live`)

// export const VillaAdd = (payload) => post('/villas', payload)
// export const VillaRemove = (id) => remove('/api/villas/' + id)

