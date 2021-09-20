import * as React from 'react';
import { MyEventForm } from './components/MyEventForm';
import { Row } from 'antd';

export function MyEventCreateUpdatePage() {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
           <MyEventForm/>
       </Row>
    );
}