import React from 'react';
import styled from 'styled-components';
import {
    FacebookIcon,
    FacebookShareButton,
    InstapaperIcon,
    InstapaperShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import { isDesktop } from 'react-device-detect';
import { HiLink } from 'react-icons/hi';
import { BiShareAlt } from 'react-icons/bi';
import copy from 'copy-to-clipboard';
import { message } from 'antd';

export const Share = React.memo((props: any) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handleShareButtonClick = () => {
        setIsOpen(false);
    }

    const handleCopyRaceLink = (currUrl) => {
        copy(currUrl);
        message.success('Copied the race link');
        handleShareButtonClick();
        return;
    }

    const handleGeneralShareClick = () => {
        const currentUrl = window?.location.href;

        if (isDesktop) {
            handleCopyRaceLink(currentUrl);
            return;
        }

        if (navigator?.share) {
            navigator.share({ url: currentUrl })
                .catch(err => {
                    handleCopyRaceLink(currentUrl);
                });

            return;
        }

        handleCopyRaceLink(currentUrl);

    }

    const currentUrl = window?.location?.href;

    return (
        <ShareButtonWrapper style={{...props.style}}>
            <ButtonContainer style={{ width: '30px', height: '30px' }} onClick={() => setIsOpen(!isOpen)}>
                <ShareButton />
            </ButtonContainer>
            {
                isOpen && <ShareDropdown>
                    <ShareButtonItemWrapper onClick={handleShareButtonClick}>
                        <ShareButtonInnerWrapper onClick={handleGeneralShareClick} style={{ background: 'green' }}>
                            <HiLink style={{ fontSize: '24px', color: '#FFF' }} />
                        </ShareButtonInnerWrapper>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper onClick={handleShareButtonClick}>
                        <FacebookShareButton quote={currentUrl} url={currentUrl}>
                            <FacebookIcon size={35} round={true} />
                        </FacebookShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper onClick={handleShareButtonClick}>
                        <InstapaperShareButton url={currentUrl}>
                            <InstapaperIcon size={35} round={true} />
                        </InstapaperShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper onClick={handleShareButtonClick}>
                        <TwitterShareButton url={currentUrl}>
                            <TwitterIcon size={35} round={true} />
                        </TwitterShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper onClick={handleShareButtonClick}>
                        <WhatsappShareButton url={currentUrl}>
                            <WhatsappIcon size={35} round={true} />
                        </WhatsappShareButton>
                    </ShareButtonItemWrapper>
                </ShareDropdown>
            }
        </ShareButtonWrapper>
    )
});

const ShareButtonWrapper = styled.div`
    position: relative;
`;

const ShareButtonItemWrapper = styled.div`
    margin: 8px 0px;
`;

const ShareButton = styled(BiShareAlt)`
    font-size: 24px;
`;

const ShareDropdown = styled.div`
    width: 56px;
    background: #fff;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
    border-radius: 20px;
    position: absolute;
    height: auto;
    top: 50px;
    padding: 0 10px;
    text-align: center;
    z-index: 10000;
`;

const ButtonContainer = styled.div`
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin: 0 10px;
    cursor: pointer;
`;

const ShareButtonInnerWrapper = styled.div`
    width: 35px;
    height:35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
`;