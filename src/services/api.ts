import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apicoleta.leandrorocha.dev'
})

export default api;