import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostInnerWrapper } from '../../LinkToProviders';
import { instagramActions } from '../slice';
import { selectPosts } from '../slice/selectors';
import PostTemplate from './PostTemplate';
import { Spin } from 'antd';

const InstagramPosts = () => {
    const posts = useSelector(selectPosts);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(instagramActions.getPosts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderFacebookFeeds = () => {
        if (posts.length === 0)
            return <Spin />;

        return posts.map((post, index) => (
            <PostTemplate index={index} post={post} />
        ));
    }

    return (
        <PostInnerWrapper>
            {renderFacebookFeeds()}
        </PostInnerWrapper>
    )
}

export default InstagramPosts