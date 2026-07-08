import api from './api';

const unwrap = (response) => response.data;

export const categoriesService = {
    list: () => api.get('/categories').then(unwrap),
    getById: (id) => api.get(`/categories/${id}`).then(unwrap),
    create: (payload) => api.post('/categories', payload).then(unwrap),
    update: (id, payload) => api.put(`/categories/${id}`, payload).then(unwrap),
    remove: (id) => api.delete(`/categories/${id}`).then(unwrap),
};

export const expensesService = {
    list: () => api.get('/expenses').then(unwrap),
    getById: (id) => api.get(`/expenses/${id}`).then(unwrap),
    create: (payload) => api.post('/expenses', payload).then(unwrap),
    update: (id, payload) => api.put(`/expenses/${id}`, payload).then(unwrap),
    remove: (id) => api.delete(`/expenses/${id}`).then(unwrap),
    calculateTotal: () => api.get('/expenses/summary/total').then(unwrap),
    totalByCategory: () => api.get('/expenses/summary/category').then(unwrap),
    count: () => api.get('/expenses/summary/count').then(unwrap),
};
