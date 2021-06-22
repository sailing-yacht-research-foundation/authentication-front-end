import React from 'react';
import { Row } from 'antd';
import { FacebookIntegration } from './Facebook';
import { InstagramIntegration } from './Instagram';
import { TwitterIntegration } from './Twitter';

export const LinkToProviders = () => {
    return (
        <Row justify="center" align="middle">
            <FacebookIntegration/>
            <InstagramIntegration/>
            <TwitterIntegration/>
        </Row>
    )
}