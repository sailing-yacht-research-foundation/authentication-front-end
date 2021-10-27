import React from 'react';
import styled from 'styled-components';
import BG from '../assets/sail.webp';
import Handicap from '../assets/sport-logos/Handicap-sailing.svg';
import KiteSurfing from '../assets/sport-logos/kitesurfing.svg';
import OneDesign from '../assets/sport-logos/One-design.svg';
import WindSurfing from '../assets/sport-logos/windsurfing.svg';
import Winging from '../assets/sport-logos/Winging.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { SimpleVideoPlane } from 'app/pages/AboutPage/components/SimpleVideoPlane';

export const LeftPanel = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <SimpleVideoPlane />
            <ContentWrapper>
                <Title>{t(translations.login_page.leftpanel_title)}</Title>
                <Description>
                    {t(translations.login_page.leftpanel_description)}
                </Description>

                <PartnerPlaceHolder>
                    <PartnerLogoImage src={Handicap} />
                    <PartnerLogoImage src={KiteSurfing} />
                    <PartnerLogoImage src={OneDesign} />
                    <PartnerLogoImage src={WindSurfing} />
                    <PartnerLogoImage src={Winging} />
                </PartnerPlaceHolder>
            </ContentWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    color: #fff;
    font-family: 'Open Sans';
    padding: 0 130px;
`;

const Title = styled.h1`
    font-weight: 700;
    font-size: 50px;
    line-height: 68px;
    padding-top: 119px;
    color: #fff;
`;

const Description = styled.p`
    font-size: 18px;
    line-height: 24.5px;
    margin-top: 73px;
`;

const PartnerPlaceHolder = styled.div`
    display: flex;
    margin-top: 163px;
    justify-content:center;
`;

const PartnerLogoImage = styled.img`
    margin: 0 15px;
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 11;
`