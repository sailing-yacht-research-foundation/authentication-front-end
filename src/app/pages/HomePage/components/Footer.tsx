import React from 'react';
import styled from 'styled-components';
import { Typography, Button, Row, Col, Divider } from 'antd';
import { Logo } from 'app/components/NavBar/Logo';
import { Link } from 'react-router-dom';

export const Footer = (props) => {
    return (
        <Wrapper>
            <Typography.Title className="text-white" style={{ marginTop: '25px' }} level={3}>
                Are you a developer who wants to use My Sailing Profile?
            </Typography.Title>
            <Button size={'large'} className="syrf-button" style={{ marginTop: '20px', marginBottom: '20px' }}>Developers</Button>
            <Row justify="center" align="middle">
                <Col lg={16}>
                    <Row>
                        <Col lg={5}>
                            <Logo type="light" style={{ marginBottom: '30px' }} />
                            <span className="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit veritatis, in consequatur voluptatum velit ea aperiam dolore magni voluptates alias id delectus suscipit quae nulla! Delectus provident fuga doloribus vel.</span>
                        </Col>
                        <Col lg={14} xs={24} style={{ marginTop: '50px' }}>
                            <Row justify="center" align="middle" style={{ marginTop: '10px' }}>
                                <a className="text-white" href="https://syrf.io">SYRF</a>
                            </Row>
                            <Row justify="center" align="middle" style={{ marginTop: '10px' }}>
                                <Link className="text-white" to="https://syrf.io">Privacy Policy</Link>
                            </Row>
                            <Row justify="center" align="middle" style={{ marginTop: '10px' }}>
                                <Link className="text-white" to="https://syrf.io">End user license agreement</Link>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider/>
            <Row>
                <FooterTextCopyRight>Copyright (c) 2021 Sailing Yacht Research Foundation</FooterTextCopyRight>
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    display: flex;
    justify-content:center;
    align-items: center;
    flex-direction: column;
    background-color: #001529;
    padding: 30px 15px;
    text-align: center;
`

const FooterTextCopyRight = styled.div`
   margin-top: 30px;
   color: #fff;
   font-size: 0.8rem;
`