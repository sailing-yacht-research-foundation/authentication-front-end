import React from 'react';
import { Carousel, Image } from 'antd';
import Background from './../assets/hero-homepage-3.jpg';
import styled from 'styled-components';

export const BenefitCarousel = (props) => {

    return (
        <Carousel autoplay={true}>
            <CarouselOuterContainer>
                <CarouselInnerContainer>
                    <CarouselBackgroundImage style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Background})`,
                        backgroundSize: 'cover'
                    }} />
                    <CarouselText>One password for all sailing app and data</CarouselText>
                    <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer>
                    <CarouselBackgroundImage style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Background})`,
                        backgroundSize: 'cover'
                    }} />
                    <CarouselText>You control who can access your sailing data</CarouselText>
                    <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer>
                    <CarouselBackgroundImage style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${Background})`,
                        backgroundSize: 'cover'
                    }} />
                    <CarouselText>GDPR & CCPA Compliant</CarouselText>
                    <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                </CarouselInnerContainer>
            </CarouselOuterContainer>

            <CarouselOuterContainer>
                <CarouselInnerContainer>
                    <CarouselBackgroundImage style={{
                        backgroundImage: `url(${Background})`,
                        backgroundSize: 'cover'
                    }} />
                    <CarouselText>Organization independent</CarouselText>
                    <CarouselItemDescription>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</CarouselItemDescription>
                </CarouselInnerContainer>
            </CarouselOuterContainer>
        </Carousel>
    )
}

const CarouselOuterContainer = styled.div``;

const CarouselInnerContainer = styled.div`
    position: relative;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const CarouselBackgroundImage = styled.div`
    text-align: center;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0; 
    top: 0;
    bottom: 0
`
const CarouselText = styled.h1`
    color: #fff;
    text-align: center;
    position: relative;
    padding: 0 10px;
`

const CarouselItemDescription = styled.span`
    position: relative;
    z-index: 10;
    text-align: center;
    color: #fff;
    padding: 0 15px;
`