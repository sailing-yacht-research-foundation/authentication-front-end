import React from 'react';
import { Image } from 'antd';
import { getProfilePicture } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { Post, PostUserWrapper, PostUserName, UserAvatar, PostCaption } from '../../LinkToProviders';

const PostTemplate = (props) => {
    const { post, index } = props;

    const user = useSelector(selectUser);

    return (
        <Post key={index}>
            <PostUserWrapper>
                <UserAvatar style={{ background: `url(${getProfilePicture(user)})`, backgroundSize: 'cover' }}></UserAvatar>
                <PostUserName>You</PostUserName>
            </PostUserWrapper>
            <PostCaption>{post.caption}</PostCaption>
            <Image src={post.media_url} />
        </Post>
    )
}

export default PostTemplate