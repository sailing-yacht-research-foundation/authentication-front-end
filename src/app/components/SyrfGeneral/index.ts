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

export const PageHeaderText = styled.h2`
    margin: 0;
    padding: 0;
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