import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { getProfilePicture } from 'utils/user-utils';
import { Post, PostUserWrapper, PostUserName, UserAvatar, PostCaption } from '../../LinkToProviders';

const PostTemplate = (props) => {

    const { index, post } = props;

    const user = useSelector(selectUser);

    const renderCaption = () => {
        if (post.attachments && post.attachments?.data?.length > 0) {
            if (post.attachments.data[0].description)
                return post.attachments.data[0].description;
            else if (post.attachments.data[0].title)
                return post.attachments.data[0].title;
        }

        return '';
    }

    return (
        <Post key={index}>
            <PostUserWrapper>
                <UserAvatar style={{ background: `url(${getProfilePicture(user)})`, backgroundSize: 'cover' }}></UserAvatar>
                <PostUserName>You</PostUserName>
            </PostUserWrapper>
            <PostCaption>{ renderCaption() }</PostCaption>
        </Post>
    )
}

export default PostTemplate