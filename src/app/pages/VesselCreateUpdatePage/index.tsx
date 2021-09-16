import React from 'react';
import { Row } from 'antd';
import { VesselForm } from './components/VesselForm';

export const VesselCreateUpdatePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <VesselForm />
        </Row>
    );
}