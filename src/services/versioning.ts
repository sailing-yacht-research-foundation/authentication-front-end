import axios from 'axios';
import { SERVICE_URL } from './serviceConstants';

/**
 * Log the version of eula/policy when an authenticated user visit the eula or privacy policy page 
 * @param user user who sees the eula/privacy-policy
 * @param versioningType either eula or policy
 * @param logVersion version of the eula/policy, for example: 2021-07-28 14:56
 * @returns the response
 */
export async function logVersion(email, versioningType, version) {
    return axios.post(`${SERVICE_URL}/versioning`, {
        email: email, // it helps identity who is signing the eula or privacy policy
        versioningType: versioningType,
        version: version
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}
