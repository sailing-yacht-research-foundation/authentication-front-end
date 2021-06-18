import '../styles/benefit-carousel.css';
import React from 'react';
import { Carousel, Col, Row } from 'antd';
import styled from 'styled-components';

import PasswordBg from '../assets/one-password.svg';
import AccessControlBg from '../assets/access-control.svg';
import OrganizationBg from '../assets/organization.svg';
import GDPRBg from '../assets/gdpr.svg';

const backgroundProperties = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: '100% -50%'
}

export const BenefitCarousel = (props) => {

    return (
        <Carousel
            slidesToShow={1}
            dots={{ className: 'carousel-dot custom' }}>
            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24}>
                            <CarouselText className="section-header-text">One password for all sailing app and data</CarouselText>
                            <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24}>
                            <CarouselImage className="carousel-image-background" style={{ backgroundImage: `url(${PasswordBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24}>
                            <CarouselText className="section-header-text">You control who can access your sailing data</CarouselText>
                            <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24}>
                            <CarouselImage className="carousel-image-background" style={{ backgroundImage: `url(${AccessControlBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24}>
                            <CarouselText className="section-header-text">GDPR & CCPA Compliant</CarouselText>
                            <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24}>
                            <CarouselImage className="carousel-image-background" style={{ backgroundImage: `url(${GDPRBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24}>
                            <CarouselText className="section-header-text">Organization independent</CarouselText>
                            <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24}>
                            <CarouselImage className="carousel-image-background" style={{ backgroundImage: `url(${OrganizationBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>
        </Carousel>
    )
}

const CarouselOuterContainer = styled.div`
`;

const CarouselInnerContainer = styled.div`
    padding: 0 120px;
`;

const CarouselImage = styled.div`
    height: 100%;
    background-size: cover;
    width: 100%;
    height: 500px;
`
const CarouselText = styled.h1`
    max-width: 499px;
    margin-top: 88px;
`

const CarouselItemDescription = styled.p`
    text-align: left;
    font-size: 14px;
    font-weight: 400px;
    line-height: 28px;
    color: #737475;
`