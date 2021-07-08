import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFacebookSlice } from '../slice';
import { selectPosts } from '../slice/selectors';
import PostTemplate from './PostTemplate';
import { Timeline } from 'antd';

const FacebookPosts = () => {
    const posts = useSelector(selectPosts);

    const { actions } = useFacebookSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getPosts());
    }, []);

    const renderFacebookPosts = () => {
        return posts.map(post => (
            <PostTemplate post={post} />
        ));
    }

    return (
        <Timeline>
            {renderFacebookPosts()}
        </Timeline>
    )
}

export default FacebookPosts