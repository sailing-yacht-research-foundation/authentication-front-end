import React from 'react';
import { Row } from 'antd';
import { Settings } from './Settings';

export const ProfileSettingsPage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <Settings/>
        </Row>
    )
}