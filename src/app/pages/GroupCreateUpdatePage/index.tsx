import * as React from 'react';
import { Row } from 'antd';
import { GroupForm } from './components/GroupForm';

export function GroupCreateUpdatePage() {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <GroupForm />
        </Row>
    );
}