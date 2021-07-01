import React from 'react';
import styled from 'styled-components';
import BG from '../assets/sail.webp';
import PartnerLogo from '../assets/dummy-logo.svg';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';


export const LeftPanel = () => {
    const { t, i18n } = useTranslation();

    return (
        <Wrapper>
            <Title>{t(translations.login_page.leftpanel_title)}</Title>
            <Description>
            {t(translations.login_page.leftpanel_description)}
            </Description>

            <PartnerPlaceHolder>
                <PartnerLogoImage src={PartnerLogo}/>
                <PartnerLogoImage src={PartnerLogo}/>
                <PartnerLogoImage src={PartnerLogo}/>
                <PartnerLogoImage src={PartnerLogo}/>
                <PartnerLogoImage src={PartnerLogo}/>
            </PartnerPlaceHolder>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background: linear-gradient(0deg, rgba(14, 80, 182, 0.92), rgba(14, 80, 182, 0.92)), url(${BG});
    background-size: cover;
    color: #fff;
    font-family: 'Open Sans';
    padding: 0 130px;
`

const Title = styled.h1`
    font-weight: 700;
    font-size: 50px;
    line-height: 68px;
    padding-top: 119px;
    color: #fff;
`

const Description = styled.p`
    font-size: 18px;
    line-height: 24.5px;
    margin-top: 73px;
`

const PartnerPlaceHolder = styled.div`
    display: flex;
    margin-top: 163px;
    justify-content:center;
`

const PartnerLogoImage = styled.img`
    margin: 0 15px;
`