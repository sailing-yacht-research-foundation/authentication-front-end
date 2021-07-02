import React from 'react';
import { Row } from 'antd';
import { Profile } from './components/Profile';

export const ProfilePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <Profile />
        </Row>
    )
}