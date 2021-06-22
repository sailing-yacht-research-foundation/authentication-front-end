import React from 'react';
import { Row } from 'antd';
import { Profile } from './components/Profile';

export const ProfilePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#E5E5E5' }}>
            <Profile />
        </Row>
    )
}