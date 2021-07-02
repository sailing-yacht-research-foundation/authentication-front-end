import React, { useState } from 'react';
import { Row } from 'antd';
import { FacebookIntegration } from './Facebook';
import { InstagramIntegration } from './Instagram';
import { TwitterIntegration } from './Twitter';
import {
    SyrfFormWrapper,
    SyrfFormTitle
} from 'app/components/SyrfForm';
import { useEffect } from 'react';

const FACEBOOK = 0;
const INSTAGRAM = 1;
const TWITTER = 2;

export const LinkToProviders = () => {
    const [selectedProvider, setSelectedProvider] = useState(FACEBOOK);

    useEffect(() => {
        console.log(selectedProvider);
    }, [selectedProvider]);

    return (
        <SyrfFormWrapper style={{ marginTop: '33px' }}>
            <SyrfFormTitle>Social Profiles Connection</SyrfFormTitle>
            <Row justify="start" align="middle">
                <FacebookIntegration
                    onClick={()=> setSelectedProvider(FACEBOOK)}
                    active={selectedProvider === FACEBOOK} />
                <InstagramIntegration
                    onClick={()=> setSelectedProvider(INSTAGRAM)}
                    active={selectedProvider === INSTAGRAM} />
                <TwitterIntegration
                    onClick={()=> setSelectedProvider(TWITTER)}
                    active={selectedProvider === TWITTER} />
            </Row>
        </SyrfFormWrapper>
    )
}