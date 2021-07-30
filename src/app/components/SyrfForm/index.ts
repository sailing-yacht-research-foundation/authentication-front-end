import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { Input, Button, Select } from 'antd';
import PhoneInput from 'react-phone-input-2';
import { media } from 'styles/media';

export const SyrfFormWrapper = styled.div`
    background: #fff;
    padding: 50px 15px;
    border-radius: 10px;
    width: 100%;
    padding-bottom: 30px;

    &.danger-zone {
        margin-top: 30px;
    }

    ${media.medium`
        width: 55%;
        padding: 50px 56px;
    `}
`;

export const SyrfSubmitButton = styled(Button)`
    width: 100%;
    padding: 20px 0;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0.03em;
    display: flex;
    justify-content: center;
    align-items:center;
`

export const SyrfInputField = styled(Input)`
    border-radius: 10px;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
    height: 36px;
`;

export const SyrfPasswordInputField = styled(Input)`
    border-radius: 10px;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
`;

export const SyrfPhoneInput = styled(PhoneInput)`
`;

export const SyrfFieldLabel = styled.label`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.03em;
    text-align: left;
`;

export const SyrfFormTitle = styled.div`
    font-family: ${StyleConstants.FONT_ROBOTO};
    font-size: 30px;
    font-style: normal;
    font-weight: 500;
    line-height: 35px;
    letter-spacing: 0.03em;
    text-align: left;
    padding-bottom: 35px;
`;

export const SyrfFormButton = styled(Button)`
    width: 100%;
    height: 36px;
    border-radius: 4px;
    background:  #348BCD;
    font-family: ${StyleConstants.FONT_OPEN_SANS};
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 19px;
    color: #fff;
`;

export const SyrfFormSelect = styled(Select)`
    border-radius: 10px;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
    height: 36px;

    > div {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
    }
`;

export const SyrfButtonTitle = styled.h4`
    color: #595959;
`;

export const SyrfButtonDescription = styled.span`
    font-size: 13px;
    color: #000000d9;
`;