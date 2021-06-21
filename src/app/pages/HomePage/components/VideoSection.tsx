import React from 'react';
import styled from 'styled-components/macro';
import { Col, Row, Button, Space, Typography } from 'antd';
import SailingBackground from '../assets/screen-0.jpg';
import { useHistory } from 'react-router';

export const VideoSection = (props) => {
    const history = useHistory();

    return (
        <Wrapper>
            <Row>
                <Typography.Title className="text-white uppercase">One Login</Typography.Title>
            </Row>
            <Row>
                <Typography.Title className="text-white uppercase">Ultimate Potential</Typography.Title>
            </Row>
            <Row >
                <Space size={15}>
                    <Col>
                        <Button onClick={() => history.push('/signin')} className="syrf-button-outline">Login</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => history.push('/signup')} className="syrf-button">Signup</Button>
                    </Col>
                </Space>
            </Row>

        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 550px;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${SailingBackground});
    background-size: cover;
    margin-bottom: 70px;
    text-align:center;
`;

