import React from 'react';
import styled from 'styled-components';
import { Typography, Button, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { ReactComponent as Logo } from './assets/logo-light.svg';

export const Footer = (props) => {

    const { t } = useTranslation();

    return (
        <Wrapper>
            <DeveloperSectionContainer>
                <Typography.Title className="section-header-text">
                    {t(translations.home_page.footer.title)}
                </Typography.Title>

                <DeveloperDescription>
                    {t(translations.home_page.footer.description)}
                </DeveloperDescription>

                <Button size={'large'} className="syrf-button" style={{ marginTop: '20px', marginBottom: '20px' }}>{t(translations.home_page.footer.developer_button)}</Button>
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
                        <SYRFDescription>{t(translations.home_page.footer.syrf_description)}</SYRFDescription>
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
                            <StyledLink to="privacy-policy">{t(translations.home_page.footer.policy_privacy_link)}</StyledLink>
                        </StyledRow>

                        <StyledRow justify="end" align="middle" style={{ marginTop: '10px' }}>
                            <StyledLink to="eula">{t(translations.home_page.footer.eula_link)}</StyledLink>
                        </StyledRow>
                    </Col>
                </Row>

                <Divider />

                <FooterTextCopyRight>{t(translations.home_page.footer.copyright)}</FooterTextCopyRight>
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