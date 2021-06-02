import React from 'react';
import { Row } from 'antd';
import { Profile } from './components/Profile';

export const ProfilePage = () => {
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Profile />
        </Row>
    )
}