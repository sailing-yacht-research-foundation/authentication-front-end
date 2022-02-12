import React from 'react';
import { Row } from 'antd';
import { LiferaftForm } from './components/LiferaftForm';

export const LiveraftCreateUpdatePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <LiferaftForm />
        </Row>
    );
}