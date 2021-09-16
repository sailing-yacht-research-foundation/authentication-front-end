import React from 'react';
import { Row } from 'antd';
import { ParticipantForm } from './components/ParticipantForm';

export const ParticipantCreateUpdatePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <ParticipantForm />
        </Row>
    );
}