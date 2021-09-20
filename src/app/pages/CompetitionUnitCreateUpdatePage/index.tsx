import React from 'react';
import { Row } from 'antd';
import { CompetitionUnitForm } from './components/CompetitionUnitForm';

export const CompetitionUnitCreateUpdatePage = () => {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <CompetitionUnitForm />
        </Row>
    );
}