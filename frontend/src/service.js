import axios from 'axios';

const client = axios.create({
    baseURL: process.env.REACT_APP_GATEWAY_URL
})

export const ping = async () => {
    const { data } = await client.get('/ping')
    return data
}
