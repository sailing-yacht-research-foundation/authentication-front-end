import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { media } from 'styles/media';
import { Button, Input, Menu } from 'antd';
import { RiCloseCircleFill } from 'react-icons/ri';
import { ignoreBrowserSupportAttributes } from 'utils/constants';

export const PageHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;
`;

export const PageHeaderContainerResponsive = styled.div`
    display: flex;
    flex-direction: column-reverse;
    padding: 12px 12px 0;

    ${media.medium`
        display: flex;
        flex-direction: row !important;
        justify-content: space-between;
        align-items: center;

        & > h2 {
            align-self: center;
        }

        & .ant-space {
            align-self: center !important;
        }

        & button {
            align-self: center;
        }
    `}

    & > h2 {
        align-self: flex-start;
    }

    & .ant-space {
        align-self: flex-end;
    }

    & button {
        align-self: flex-end;
    }
`;

export const PageHeaderContainerSimple = styled.div`
    display: block;
    text-align: left;

    ${media.medium`
        align-items: center;
        display: flex;
        justify-content: space-between;
    `}
`;

export const PageHeaderText = styled.h2`
    margin: 0;
    padding: 0;
    text-transform: capitalize;
`;

export const PageHeaderTextSmall = styled.h3`
    ${PageHeaderText}
`;

export const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};

  &:fullscreen {
    background: #fff !important;
}
`;

export const CreateButton = styled(Button)`
    margin: 10px 0;
    border-radius: 5px;
    color: #40a9ff;
    border-color: #40a9ff;
`;

export const DeleteButton = styled(Button)`
    margin: 10px 0;
    border-radius: 5px;
    color: red;
    border-color: red;
`;


export const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    > div {
        width: 100% !important;
    }

    ${media.medium`
        margin-top: 100px;
        > div {
            width: 400px !important;
        }
    `}
`;

export const LottieMessage = styled.p`
   color: #70757a;
   padding: 15px 15px;
   width: 100% !important;
`;


export const BorderedButton = styled(Button)`
    border-radius: 5px;
`;

export const TableWrapper = styled.div`
    margin: 0px 15px;
`;

export const PageInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PageDescription = styled.p`
    padding: 0 15px;
    margin-bottom: 8px;
`;

export const PageHeading = styled.h2`
    padding: 10px 15px;
    padding-bottom: 0px;
    text-transform: capitalize;
    margin-bottom: 4px;
`;

export const PageInfoOutterWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const GobackButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

export const SuggestionWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 45px;
    z-index: 15;
`;

export const SuggestionCriteria = styled.div`
    width: 100%;
    background: #fff;
    padding: 5px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    :hover, &.active {
        background: ${StyleConstants.MAIN_TONE_COLOR};
        color: #fff;
    }
`;

export const SuggestionInnerWrapper = styled.div`
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
`;

export const ContentEditableTextRemover = styled(RiCloseCircleFill)`
    position: absolute;
    right: 0;
    top: 27%;
    right: 5px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.25);
`;

export const DownloadButton = styled(BorderedButton)`
background: #DC6E1E;
border: 1px solid #fff;
font-size: 20px;

display: flex;
align-items: center;
justify-content: center;

:hover, :focus {
    background: #DC6E1E;
    border: 1px solid #fff;
}
`;


export const SpinLoadMoreContainer = styled.div`
    display: block;
    text-align: center;
    padding: 10px;
`;

export const PaginationContainer = styled.div`
text-align: right;

margin: 25px 0;
`;

export const StyledPLaceDropdown = styled(Menu)`
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    width: 100%;
`;

export const ItemAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;

export const FormPhotoWrapper = styled.div`
    width: 100%;

    img {
        width: 100%;
        height: 100%px;
        object-fit: cover;
        max-height: 250px;
    }
`;

export const FormPhotoHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ItemVerifyMessage = styled.div`
    color: rgb(115, 116, 117);
    font-size: 13px;
    margin-top: -20px;
    text-align: right;

    &.verified {
        color: ${StyleConstants.MAIN_TONE_COLOR} !important;
    }
`;

export const IconWrapper = styled.span`
    margin-right: 5px;
`;

export const FilterWrapper = styled.div`
    text-align: right;
    text-transform: capitalize;
`;

export const PageHeaderDescription = styled.span`
    color: #00000073;
`;

export const LiveDot = styled.span`
    width: 7px;
    height: 7px;
    background: #606060;
    border-radius: 50%;
    display: inline-block;
    margin-left: 10px;

    &.live {
        background: #ff0000;
    }
`;

export const RightAligner = styled.div`
    float: right;
    margin: 10px 0;
`;

export const MapPaginationWrapper = styled.div`
    position: absolute;
    bottom: 110px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 570px;
    max-width: 98%;
    z-index: 11;
    text-align: center;
    .ant-pagination-item:not(.ant-pagination-item-active) a {
    color: rgba(0, 0, 0, 0.85) !important;
    }
`;

export const RaceStatusModalWrapper = styled.p`
    font-size: 16px;
    margin-bottom: 0;
    text-align: center;
`;

export const InputWithNoBrowserSupportAttributes = styled(Input).attrs(() => ({
    ...ignoreBrowserSupportAttributes
}))``;

export const InputPasswordWithNoBrowserSupportAttributes = styled(Input.Password).attrs(() => ({
    ...ignoreBrowserSupportAttributes
}))``;

export const EditorItem = styled.div`
    width: 45px;
    height: 45px;
    cursor: pointer;
    &:not(:last-child) {
        margin-right: 7px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #eee;
    }
`;
