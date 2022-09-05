import NoAvatar from 'app/components/NavBar/assets/no-avatar.png';
import { replaceImageExtensionWithThumbnailPostfix } from './helpers';

/**
 * Get user attribute based of the attribute name
 * @param user
 * @param attribute
 * @returns attribute
 */
export const getUserAttribute = (user, attribute: string) => {
    if (user && user.attributes && user.attributes[attribute]) {
        return user.attributes[attribute][0];
    }

    return null;
}

/**
 * Get the profile picture of the user
 * @param user
 * @returns profile picture
 */
export const getProfilePicture = (user) => {
    const picture = getUserAttribute(user, 'picture');

    if (picture && !isNaN(picture)) return `/default-avatars/avatar-${picture}.png`;

    if (picture) return picture;

    return NoAvatar;
}

/**
 * Check if user's phone number is verified
 * @param user
 * @param field
 * @returns
 */
export const checkForVerifiedField = (user, field) => {
    return field === 'email' ? user.emailVerified : user.phone_number_verified;
}

export const renderAvatar = (picture, renderAsThumbnail = true) => {

    if (picture && !isNaN(picture)) return `/default-avatars/avatar-${picture}.png`;

    if (picture) {
        return renderAsThumbnail ? replaceImageExtensionWithThumbnailPostfix(picture) : picture;
    }

    return NoAvatar;
}

/**
 * Convert interest object into array.
 * @param user
 * @returns
 */
export const getUserInterestsAsArray = (user) => {
    return !!user.interests ? Object.entries(user.interests).reduce((acc: any[], [key, value]) => {
        if (value) {
            acc.push(key);
        }
        return acc;
    }, []) : [];
}

export const getUserName = (user) => {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
}
