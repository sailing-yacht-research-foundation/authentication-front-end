import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFacebookSlice } from '../slice';
import { selectPosts } from '../slice/selectors';
import PostTemplate from './PostTemplate';
import { Spin } from 'antd';
import { PostInnerWrapper } from '../../LinkToProviders';

const FacebookPosts = () => {
    const posts = useSelector(selectPosts);

    const { actions } = useFacebookSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getPosts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderFacebookPosts = () => {
        if (posts.length === 0)
            return <Spin />;

        return posts.map(post => (
            <PostTemplate post={post} />
        ));
    }

    return (
        <PostInnerWrapper>
            {renderFacebookPosts()}
        </PostInnerWrapper>
    )
}

export default FacebookPosts