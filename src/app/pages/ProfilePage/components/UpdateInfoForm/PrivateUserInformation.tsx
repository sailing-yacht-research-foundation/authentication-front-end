import React from 'react';
import { Select, Col, Row, Form, DatePicker, Menu } from 'antd';
import { languagesList } from 'utils/languages-util';
import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfPhoneInput,
    SyrfFormTitle,
    SyrfFormSelect,
} from 'app/components/SyrfForm';
import { checkForVerifiedField, getUserAttribute } from 'utils/user-utils';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { FIELD_VALIDATE } from 'utils/constants';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

const format = "DD.MM.YYYY HH:mm";

const disabledDates = [
    {
        start: "29.12.2002 13:00",
        end: moment().format(format)
    },
];

export const PrivateUserInformation = (props) => {

    const { authUser, address, setAddress, setShowPhoneVerifyModal, sendPhoneVerification } = props;

    const { t } = useTranslation();

    const renderLanguegesDropdownList = () => {
        const objectArray = Object.entries(languagesList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value.nativeName}</Select.Option>
        });
    }

    const renderVerifiedStatus = (type: string) => {
        const verified = checkForVerifiedField(authUser, type);
        const userPhoneNumberExists = !!getUserAttribute(authUser, 'phone_number');

        if (type === FIELD_VALIDATE.email)
            return <ItemVerifyMessage className={verified ? 'verified' : ''}>{t(translations.profile_page.update_profile.your_email_is, { verify_status: (verified ? 'verified' : 'not verified') })}</ItemVerifyMessage>;

        if (userPhoneNumberExists) {
            return verified ? (<ItemVerifyMessage className={'verified'}>{t(translations.profile_page.update_profile.your_phone_is_verified)}</ItemVerifyMessage>) :
                (
                    <ItemVerifyMessage>{t(translations.profile_page.update_profile.your_phone_is_not_verified)}</ItemVerifyMessage>
                )
        }
    }

    return (
        <Wrapper>
            <SyrfFormTitle>{t(translations.profile_page.update_profile.private_user_details)}</SyrfFormTitle>
            <Form.Item
                label={<SyrfFieldLabel>Email</SyrfFieldLabel>}
                name="email"
                rules={[{ required: true, type: 'email' }]}
            >
                <SyrfInputField disabled />
            </Form.Item>
            {renderVerifiedStatus(FIELD_VALIDATE.email)}

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.address)}</SyrfFieldLabel>}
                name="address"
            >
                <PlacesAutocomplete
                    value={address}
                    onChange={(address) => { setAddress(address) }}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                        <>
                            <SyrfInputField
                                {...getInputProps({
                                    placeholder: t(translations.profile_page.update_profile.search_places),
                                    className: 'location-search-input',
                                })}
                                value={address}
                            />
                            {suggestions.length > 0 && <StyledPLaceDropdown>
                                {suggestions.map((suggestion) => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                        <Menu.Item
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                            key={suggestion.index}
                                        >
                                            <span>{suggestion.description}</span>
                                        </Menu.Item>
                                    );
                                })}
                            </StyledPLaceDropdown>}
                        </>
                    )}
                </PlacesAutocomplete>
            </Form.Item>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.date_of_birth)}</SyrfFieldLabel>}
                        name="birthdate"
                        rules={[{ type: 'date', required: true }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            className="syrf-datepicker"
                            showToday={false}
                            disabledDate={current => {
                                return disabledDates.some(date =>
                                    current.isBetween(
                                        moment(date["start"], format),
                                        moment(date["end"], format)
                                    )
                                );
                            }}
                            dateRender={current => {
                                return (
                                    <div className="ant-picker-cell-inner">
                                        {current.date()}
                                    </div>
                                );
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.world_sailing_number)}</SyrfFieldLabel>}
                        name="sailing_number"
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.phone_number)}</SyrfFieldLabel>}
                        name="phone_number"
                        rules={[{ type: 'string' }]}
                    >
                        <SyrfPhoneInput
                            inputClass="syrf-phone-number-input"
                            buttonClass="syrf-flag-dropdown"
                            placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                    </Form.Item>
                    {renderVerifiedStatus(FIELD_VALIDATE.phone)}
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.language)}</SyrfFieldLabel>}
                        name="language"
                        rules={[{ required: true }]}
                    >
                        <SyrfFormSelect placeholder={t(translations.profile_page.update_profile.select_a_language)}
                            showSearch
                            filterOption={(input, option) => {
                                if (option) {
                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }

                                return false;
                            }}
                        >
                            {
                                renderLanguegesDropdownList()
                            }
                        </SyrfFormSelect>
                    </Form.Item>
                </Col>
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    background: #fff;
    padding: 30px 25px;
    border-radius: 10px;
    margin: 30px 0;
`;

const ItemVerifyMessage = styled.div`
    color: rgb(115, 116, 117);
    font-size: 13px;
    margin-top: -20px;
    text-align: right;

    &.verified {
        color: ${StyleConstants.MAIN_TONE_COLOR} !important;
    }
`;

const StyledPLaceDropdown = styled(Menu)`
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    width: 100%;
`;