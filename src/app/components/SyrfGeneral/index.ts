import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { media } from 'styles/media';
import { Button } from 'antd';

export const PageHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 30px 15px;
`;

export const PageHeaderContainerResponsive = styled.div`
    display: flex;
    flex-direction: column-reverse;
    padding: 30px 15px;

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
    margin: 15px;
`;

export const PageInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const PageDescription = styled.p`
    padding: 0 15px;
`;

export const PageHeading = styled.h2`
    padding: 10px 15px;
    padding-bottom: 0px;
    text-transform: capitalize;
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
    
    :hover {
        background: ${StyleConstants.MAIN_TONE_COLOR};
        color: #fff;
    }
`;

export const SuggestionInnerWrapper = styled.div`
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
`;