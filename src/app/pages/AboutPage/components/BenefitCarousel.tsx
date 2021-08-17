import '../styles/benefit-carousel.css';
import React from 'react';
import { Carousel, Col, Row } from 'antd';
import styled from 'styled-components';
import { media } from 'styles/media';

import PasswordBg from '../assets/Image-1.svg';
import AccessControlBg from '../assets/Image-2.svg';
import OrganizationBg from '../assets/Image-3.svg';
import GDPRBg from '../assets/Image-4.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const backgroundProperties = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: '100% -50%'
}

export const BenefitCarousel = (props) => {

    const { t } = useTranslation();

    return (
        <Carousel
            slidesToShow={1}
            dots={{ className: 'carousel-dot custom' }}>
            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={24} xs={24} sm={24}>
                            <CarouselText className="section-header-text">{t(translations.about_page.benefit_carousel.slide_one.title)}</CarouselText>
                            <CarouselItemDescription>{t(translations.about_page.benefit_carousel.slide_one.description)}</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={24} xs={24} sm={24}>
                            <CarouselImage className="carousel-image-container" style={{ backgroundImage: `url(${PasswordBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselText className="section-header-text">{t(translations.about_page.benefit_carousel.slide_two.title)}</CarouselText>
                            <CarouselItemDescription>{t(translations.about_page.benefit_carousel.slide_two.description)}</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselImage className="carousel-image-container" style={{ backgroundImage: `url(${AccessControlBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselText className="section-header-text">{t(translations.about_page.benefit_carousel.slide_three.title)}</CarouselText>
                            <CarouselItemDescription>{t(translations.about_page.benefit_carousel.slide_three.description)}</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselImage className="carousel-image-container" style={{ backgroundImage: `url(${GDPRBg})`, ...backgroundProperties }} />
                        </Col>
                    </Row>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer className="carousel-inner-container">
                    <Row className="carousel-row">
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselText className="section-header-text">{t(translations.about_page.benefit_carousel.slide_four.title)}</CarouselText>
                            <CarouselItemDescription>{t(translations.about_page.benefit_carousel.slide_four.description)}</CarouselItemDescription>
                        </Col>
                        <Col lg={12} md={12} xs={24} sm={24}>
                            <CarouselImage className="carousel-image-container" style={{ backgroundImage: `url(${OrganizationBg})`, ...backgroundProperties }} />
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
    padding-bottom: 80px;
`;

const CarouselImage = styled.div`
    height: 100%;
    background-size: cover;
    width: 100%;
    margin-top: 40px;
    height: 420px;

    ${media.medium`
        margin-top: 40px;
        height: 420px;
        background-position: 100% -50% !important;
    `};   
    
    ${media.small`
        margin-top: 40px;
        height: 420px;
        background-position: 50% 50% !important;
    `};  

    ${media.large`
        margin-top: 0 !important;
        height: 500px !important;
        background-position: 100% -50% !important;
    `};   
`;

const CarouselText = styled.h1`
    max-width: 499px;
    margin-top: 88px;
    text-align: center;

    ${media.large`
        text-align: left;
    `};

    ${media.medium`
        text-align: left;
    `};

    ${media.small`
        text-align: left;
    `};
`;

const CarouselItemDescription = styled.p`
    text-align: left;
    font-size: 14px;
    font-weight: 400px;
    line-height: 28px;
    color: #737475;

    text-align: center;

    ${media.large`
        text-align: left;
    `};

    ${media.medium`
        text-align: left;
    `};

    ${media.small`
        text-align: left;
    `};
`;