import axios from 'axios';

export function getMapTimezone(coordinate: number[], timestamp = new Date().getTime()) {
    return axios.get('https://maps.googleapis.com/maps/api/timezone/json', {
        params: {
            key: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
            location: coordinate.join(','),
            timestamp,
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}