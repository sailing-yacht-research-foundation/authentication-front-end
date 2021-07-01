import React from 'react';
import styled from 'styled-components';
import { Typography, Button, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { media } from 'styles/media';
import { ReactComponent as Logo } from './assets/logo-light.svg';

export const Footer = (props) => {
    return (
        <Wrapper>
            <DeveloperSectionContainer>
                <Typography.Title className="section-header-text">
                    Are you a developer who wants to use My Sailing Profile?
                </Typography.Title>

                <DeveloperDescription>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.
                </DeveloperDescription>

                <Button size={'large'} className="syrf-button" style={{ marginTop: '20px', marginBottom: '20px' }}>Developers</Button>
            </DeveloperSectionContainer>

            <SYRFFooterContainer>
                <Row justify="space-between">
                    <Col lg={{
                        offset: 3,
                        span: 4
                    }}
                        xs={{
                            span: 24
                        }}
                    >
                        <Logo style={{ marginBottom: '15px' }}/>
                        <SYRFDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit veritatis, in consequatur voluptatum velit ea aperiam dolore magni voluptates alias id delectus suscipit quae nulla! Delectus provident fuga doloribus vel.</SYRFDescription>
                    </Col>

                    <Col
                        lg={{
                            span: 8,
                            offset: 8
                        }}
                        xs={{
                            span: 24
                        }}
                    >
                        <StyledRow justify="end" align="middle" style={{ marginTop: '50px' }}>
                            <StyledLink to="/">SYRF</StyledLink>
                        </StyledRow>

                        <StyledRow justify="end" align="middle" style={{ marginTop: '10px' }}>
                            <StyledLink to="privacy-policy">Privacy Policy</StyledLink>
                        </StyledRow>

                        <StyledRow justify="end" align="middle" style={{ marginTop: '10px' }}>
                            <StyledLink to="eula">End user license agreement</StyledLink>
                        </StyledRow>
                    </Col>
                </Row>

                <Divider />

                <FooterTextCopyRight>Copyright (c) 2021 Sailing Yacht Research Foundation</FooterTextCopyRight>
            </SYRFFooterContainer>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    display: flex;
    justify-content:center;
    align-items: center;
    flex-direction: column;
    // background-color: #001529;
    text-align: center;
`;

const FooterTextCopyRight = styled.div`
   margin-top: 22px;
   margin-bottom: 22px;
   color: #fff;
   font-size: 0.8rem;
   text-align: center;
`;

const DeveloperSectionContainer = styled.div`
    background: #EBEFF7;
    width: 100%;
    text-align:center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 86px 15px;
`;

const DeveloperDescription = styled.div`
    font-size: 14px;
    font-weight: 400;
    max-width: 805px;
    margin: 15px 0;
`;

const SYRFFooterContainer = styled.div`
    background: #0C4983;
    width: 100%;
    padding: 0 15px;
    padding-top: 65px;
`;

const SYRFDescription = styled.p`
    font-weight: 400;
    color: #fff;

    ${media.large`
        text-align: left !important;
    `};

    ${media.medium`
        text-align: left !important;
    `};

    ${media.small`
        text-align:center;
    `};
`;

const StyledLink = styled(Link)`
    font-size: 24px;
    font-weight: bold;
    color: #fff;

    ${media.large`
        margin-right: 170px;
        text-align: right;
    `};

    ${media.medium`
        margin-right: 120px;
        text-align: right;
    `};
`;

const StyledRow = styled(Row)`
        justify-content: center;

    ${media.large`
        justify-content: flex-end;
    `};

    ${media.medium`
        justify-content: flex-end;
    `};

    ${media.small`
        justify-contents: center;
    `};
`