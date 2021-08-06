import '../styles/video-section.css';
import React from 'react';
import styled from 'styled-components/macro';
import { Col, Row, Button, Space, Typography } from 'antd';
import SailingBackground from './../assets/hero-homepage-3.jpg';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const VideoSection = (props) => {
    
    const { t } = useTranslation();

    const history = useHistory();

    return (
        <Wrapper className="video-section">
            <Row style={{ marginTop: '88px' }}>
                <Typography.Title className="text-white introduction-text">{t(translations.about_page.video_section.one_login)} <br /> {t(translations.about_page.video_section.ultimate_potential)}</Typography.Title>
            </Row>

            <Row  style={{ marginTop: '40px' }}>
                <Space size={15}>
                    <Col>
                        <Button onClick={() => history.push('/signin')} className="syrf-button">{t(translations.about_page.video_section.login)}</Button>
                    </Col>
                    
                    <Col>
                        <Button onClick={() => history.push('/signup')} className="syrf-button-outline">{t(translations.about_page.video_section.signup)}</Button>
                    </Col>
                </Space>
            </Row>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: 414px;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${SailingBackground});
    background-size: cover;
    background-position: 50% 35%;
    text-align:center;
    padding: 0 15px;
    padding-bottom: 50px;
`;

