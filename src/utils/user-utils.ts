import NoAvatar from 'app/components/NavBar/assets/no-avatar.png';

/**
 * Get user attribute based of the attribute name
 * @param user 
 * @param attribute 
 * @returns attribute
 */
export const getUserAttribute = (user, attribute: string) => {
    if (user && user.attributes && user.attributes[attribute]) {
        return user.attributes[attribute];
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

    if (picture) return process.env.REACT_APP_BUCKET_URL + picture;

    return NoAvatar;
}

/**
 * Check if user's phone number is verified
 * @param user 
 * @param field 
 * @returns 
 */
export const checkForVerifiedField = (user, field) => {
    return field === 'email' ? user.attributes?.email_verified : user.attributes?.phone_number_verified;
}