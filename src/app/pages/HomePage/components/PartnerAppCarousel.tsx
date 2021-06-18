import React from 'react';
import { Image, Carousel } from 'antd';
import { media } from 'styles/media';
import styled from 'styled-components/macro';
import Brand1 from '../assets/brand1.png';
import Brand2 from '../assets/brand2.png';
import Brand3 from '../assets/brand3.png';
import Brand4 from '../assets/brand4.png';

export const PartnerAppCarousel = (props) => {
    return (
        <Wrapper>
            <h1 className="section-header-text" style={{ textAlign: 'center' }}>Use with these innotive apps</h1>
            <Carousel slidesToShow={4} dots={{ className: 'carousel-dot partner-app' }} responsive={[
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 1008,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }

            ]} autoplay={true}>
                <ImageContainer style={{ padding: '50px 0' }}>
                    <Image
                        preview={false}
                        width={200}
                        src={Brand1}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand2}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand3}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand4}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        preview={false}
                        width={200}
                        src={Brand1}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand2}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand3}
                    />
                </ImageContainer>
                <ImageContainer>
                    <Image
                        width={200}
                        preview={false}
                        src={Brand4}
                    />
                </ImageContainer>
            </Carousel>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: 88px 0;
    padding: 0 15px;
`

const ImageContainer = styled.div`
    margin-top: 60px;    
`