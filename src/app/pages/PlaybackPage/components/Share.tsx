import React from 'react';
import styled from 'styled-components';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    InstapaperIcon,
    InstapaperShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import { HiShare } from 'react-icons/hi';
import { StyleConstants } from 'styles/StyleConstants';

export const Share = () => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    return (
        <ShareButtonWrapper>
            <ButtonContainer style={{ width: '30px', height: '30px' }} onClick={() => setIsOpen(!isOpen)}>
                <ShareButton />
            </ButtonContainer>
            {
                isOpen && <ShareDropdown>
                    <ShareButtonItemWrapper>
                        <EmailShareButton url="">
                            <EmailIcon size={35} round={true} />
                        </EmailShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper>
                        <FacebookShareButton url="">
                            <FacebookIcon size={35} round={true} />
                        </FacebookShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper>
                        <InstapaperShareButton url="">
                            <InstapaperIcon size={35} round={true} />
                        </InstapaperShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper>
                        <TwitterShareButton url="">
                            <TwitterIcon size={35} round={true} />
                        </TwitterShareButton>
                    </ShareButtonItemWrapper>
                    <ShareButtonItemWrapper>
                        <WhatsappShareButton url="">
                            <WhatsappIcon size={35} round={true} />
                        </WhatsappShareButton>
                    </ShareButtonItemWrapper>
                </ShareDropdown>
            }
        </ShareButtonWrapper>
    )
}

const ShareButtonWrapper = styled.div`
    position: absolute;
    bottom: 10px;
    right: 20px;
`;

const ShareButtonItemWrapper = styled.div`
    margin: 5px 0;
`;

const ShareButton = styled(HiShare)`
    color: #fff;
    font-size: 17px;
`;

const ShareDropdown = styled.div`
    width: 100%;
    background: #fff;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
    border-radius: 20px;
    position: absolute;
    height: auto;
    bottom: 50px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    align-items: center;
    // display: none;
`;

const ButtonContainer = styled.div`
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    margin: 0 10px;
`;