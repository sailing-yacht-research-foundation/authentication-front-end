import React from 'react';
import { Row } from 'antd';
import { VesselParticipantGroupForm } from './components/VesselParticipantGroupForm';

export const VesselParticipantGroupPage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <VesselParticipantGroupForm />
        </Row>
    );
}