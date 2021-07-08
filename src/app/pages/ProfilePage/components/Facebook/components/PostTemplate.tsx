import React from 'react';
import { Timeline } from 'antd';
import moment from 'moment';

const PostTemplate = ({ post }) => {
    return (
        <Timeline.Item>{moment(post.created_time).format('YYYY-MM-DD')} - {post.message}</Timeline.Item>
    )
}

export default PostTemplate