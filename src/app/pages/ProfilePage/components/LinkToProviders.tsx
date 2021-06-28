import React from 'react';
import { Row } from 'antd';
import { FacebookIntegration } from './Facebook';
import { InstagramIntegration } from './Instagram';
import { TwitterIntegration } from './Twitter';
import {
    SyrfFormWrapper,
    SyrfFormTitle
} from 'app/components/SyrfForm';

export const LinkToProviders = () => {
    return (
        <SyrfFormWrapper style={{ marginTop: '33px' }}>
            <SyrfFormTitle>Connect Social Profiles</SyrfFormTitle>
            <Row justify="center" align="middle">
                <FacebookIntegration />
                <InstagramIntegration />
                <TwitterIntegration />
            </Row>
        </SyrfFormWrapper>
    )
}