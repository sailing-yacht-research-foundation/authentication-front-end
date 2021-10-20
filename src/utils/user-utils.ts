import NoAvatar from 'app/components/NavBar/assets/no-avatar.png';

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
    return field === 'email' ? user.emailVerified : user.attributes?.phoneNumberVerified;
}

export const updateUserAttribute = (user, attributeKey, attributeValue) => {
    const attributes = user.attributes;
    const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        attributes: {
            ...user.attributes,
            [attributeKey]: attributeValue
        }
    }
}