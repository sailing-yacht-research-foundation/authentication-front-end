import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { instagramActions } from '../slice';
import { selectPosts } from '../slice/selectors';
import PostTemplate from './PostTemplate';

const InstagramPosts = () => {
    const posts = useSelector(selectPosts);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(instagramActions.getPosts());
    }, []);

    const renderFacebookFeeds = () => {
        return posts.map(post => {
            <PostTemplate post={post} />
        });
    }

    return (
        <>
            {renderFacebookFeeds()}
        </>
    )
}

export default InstagramPosts