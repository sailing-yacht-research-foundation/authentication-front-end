import NoAvatar from 'app/components/NavBar/assets/no-avatar.png';

export const getAvatar = (user) => {
    if (user.attributes && user.attributes.picture) {
        return user.attributes.picture;
    }

    return NoAvatar;
}