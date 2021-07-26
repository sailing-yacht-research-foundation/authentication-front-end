import React from 'react';
import { StyleConstants } from 'styles/StyleConstants';
import { Input } from 'antd';
import styled from 'styled-components';
import { ReactComponent as SYRFLogo } from './assets/logo-dark.svg';
import { FilterPane } from '../FilterTab/components/FilterPane';
import { media } from 'styles/media';

interface StyledSearchBarProps {
    onClick: (e: Event) => void;
    onFocus: (e: Event) => void;
}

const TAB_BAR_HEIGHT = '76px';

export const MapViewTab = () => {

    const [showSearchPanel, setShowSearchPanel] = React.useState<boolean>(false);

    return (
        <>
            <iframe title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7862661.401754289!2d105.9102078!3d15.7939252!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1627017281620!5m2!1svi!2s"
                style={{ width: '100%', height: `calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT} - ${TAB_BAR_HEIGHT})` }} // 
                loading="lazy">
            </iframe>
            <SearchBarWrapper>
                <StyledSearchBar
                    onClick={e => setShowSearchPanel(true)}
                    onFocus={e => setShowSearchPanel(true)}
                    placeholder={'Search races with SYRF'} />
                <SearchBarLogo />
            </SearchBarWrapper>
            {showSearchPanel && <StyledSearchPane closable close={() => setShowSearchPanel(false)} />}
        </>
    )
}

const SearchBarWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 530px;
    max-width: 80%;
`;

const SearchBarLogo = styled(SYRFLogo)`
    position: absolute;
    left: 15px;
    top: 0px;
    width: 45px;
    height: 45px;
`;

const StyledSearchBar = styled(Input) <StyledSearchBarProps>`
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(9, 32, 77, 0.12), 0 0 2px rgba(29, 17, 51, 0.12);
    padding-top: 10px;
    padding-bottom: 10px;
    text-indent: 60px;

    ::placeholder {
        font-weight: 500;
    }
`;

const StyledSearchPane = styled(FilterPane)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    padding: 0 20px;
    display: block;
    border-top: 1px solid #eee;
    width: 100%;

    ${media.medium`
        height: 550px;
        width: 530px;
    `}
`;