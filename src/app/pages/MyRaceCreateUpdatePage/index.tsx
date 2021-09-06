import * as React from 'react';
import { MyRaceForm } from './components/MyRaceForm';
import { Row } from 'antd';

export function MyRacePageCreateUpdatePage() {
    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
           <MyRaceForm/>
       </Row>
    );
}