import '../styles/video-section.css';
import React from 'react';
import styled from 'styled-components/macro';
import { Col, Row, Button, Space, Typography } from 'antd';
import SailingBackground from './../assets/hero-homepage-3.jpg';
import { useHistory } from 'react-router';
import { media } from 'styles/media';

export const VideoSection = (props) => {
    const history = useHistory();

    return (
        <Wrapper className="video-section">
            <Row style={{ marginTop: '88px' }}>
                <Typography.Title className="text-white introduction-text">One Login <br /> Ultimate Potential</Typography.Title>
            </Row>
            
            <Row>
                <p className="introduction-description">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.
                </p>
            </Row>

            <Row  style={{ marginTop: '40px' }}>
                <Space size={15}>
                    <Col>
                        <Button onClick={() => history.push('/signin')} className="syrf-button">Login</Button>
                    </Col>
                    
                    <Col>
                        <Button onClick={() => history.push('/signup')} className="syrf-button-outline">Signup</Button>
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
    min-height: 514px;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${SailingBackground});
    background-size: cover;
    background-position: 50% 35%;
    text-align:center;
    padding: 0 15px;
    padding-bottom: 50px;
`;

