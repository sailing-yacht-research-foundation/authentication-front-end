import React from 'react';
import { Image, Carousel, Typography } from 'antd';
import styled from 'styled-components/macro';

export const PartnerAppCarousel = (props) => {
    return (
        <Wrapper>
            <Typography.Title level={3} style={{textAlign:'center', marginBottom: 50}}>Use with these innotive apps</Typography.Title>
            <Carousel slidesToShow={3} responsive={[
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
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }

            ]} autoplay={true}>
                <div>
                    <Image
                        preview={false}
                        width={200}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
                <div>
                    <Image
                        width={200}
                        preview={false}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
                <div>
                    <Image
                        width={200}
                        preview={false}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
                <div>
                    <Image
                        width={200}
                        preview={false}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
                <div>
                    <Image
                        width={200}
                        preview={false}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
                <div>
                    <Image
                        width={200}
                        preview={false}
                        src={`https://chippou.github.io/assets/images/clients/angularjs_logo.png`}
                    />
                </div>
            </Carousel>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: 70px 0;
    padding: 0 15px;
`