import React, { useState, useEffect, useRef } from 'react';
import { Select, Col, Row, Form, DatePicker, Menu, Switch, Tooltip } from 'antd';
import PlacesAutocomplete from 'react-places-autocomplete';
import moment from 'moment';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfPhoneInput,
    SyrfFormTitle,
    SyrfFormSelect,
} from 'app/components/SyrfForm';
import { languagesList } from 'utils/languages-util';
import { translations } from 'locales/translations';
import { checkForVerifiedField, getUserAttribute } from 'utils/user-utils';
import { FIELD_VALIDATE } from 'utils/constants';
import { FilterWorldSailingNumber } from 'utils/world-sailing-number';
import countryCodeSource from '../../assets/world-sailing-number-countrycode.json';
import { sendPhoneVerification, verifyPhoneNumber } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { VerifyPhoneModal } from 'app/components/VerifyModal/VerifyPhoneModal';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { ItemVerifyMessage } from 'app/components/SyrfGeneral';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { Link } from 'react-router-dom';

const format = "DD.MM.YYYY HH:mm";

const disabledDates = [
    {
        start: "29.12.2002 13:00",
        end: moment().format(format)
    },
];

export const PrivateUserInformation = (props) => {

    const { authUser, address, setAddress, setFormHasBeenChanged } = props;

    const dispatch = useDispatch();
    const { actions } = UseLoginSlice();
    const { t } = useTranslation();
    const [isSuggestionVisible, setIsSuggestionVisible] = useState<boolean>(false);
    const [worldSailingNumber, setWorldSailingNumber] = useState('');
    const [countryCodeList, setCountryCodeList] = useState<string[]>([]);
    const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState<boolean>(false);

    const isInitRef = useRef(true);

    useEffect(() => {
        if (worldSailingNumber.length > 2) setIsSuggestionVisible(false);
        else {
            if (!isInitRef.current) {
                setIsSuggestionVisible(true);
            };

            handleFilterWorldSailingNumber(worldSailingNumber, countryCodeSource);
        }

        isInitRef.current = false;
    }, [worldSailingNumber])

    const renderLanguegesDropdownList = () => {
        const objectArray = Object.entries(languagesList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value.nativeName}</Select.Option>
        });
    }

    const sendVerificationCode = async () => {
        const response = await sendPhoneVerification();

        if (response.success) {
            toast.success(t(translations.profile_page.update_profile.you_will_receive_an_sms_or_phone_call_to_verify_your_phone_number))
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const renderVerifiedStatus = (type: string) => {
        const verified = checkForVerifiedField(authUser, type);
        const userPhoneNumberExists = !!getUserAttribute(authUser, 'phone_number');

        if (type === FIELD_VALIDATE.email)
            return <ItemVerifyMessage className={verified ? 'verified' : ''}>{t(translations.profile_page.update_profile.your_email_is, { verify_status: (verified ? 'verified' : 'not verified') })}
                { !verified && <Link to="/account-not-verified"> {t(translations.profile_page.update_profile.verify)}</Link>}
            </ItemVerifyMessage>;

        if (userPhoneNumberExists) {
            return verified ? (<ItemVerifyMessage className={'verified'}>{t(translations.profile_page.update_profile.your_phone_is_verified)}</ItemVerifyMessage>) :
                (
                    <ItemVerifyMessage>{t(translations.profile_page.update_profile.your_phone_is_not_verified)} <a href="/" onClick={(e) => {
                        e.preventDefault();
                        sendVerificationCode();
                        setShowPhoneVerifyModal(true);
                    }}>{t(translations.profile_page.update_profile.verify)}</a></ItemVerifyMessage>
                )
        }
    }

    const handleSuggestionVisible = () => {
        if (worldSailingNumber.length > 2) {
            setIsSuggestionVisible(false);
            return;
        };

        setIsSuggestionVisible(true);
    };

    const handleSuggestionNotVisible = () => {
        setIsSuggestionVisible(false);
    };

    const handleSuggestionBlur = () => {
        setTimeout(() => {
            handleSuggestionNotVisible();
        }, 200);
    };

    const handleWorldSailingNumberChange = (e) => {
        setWorldSailingNumber(e.target.value);
        setFormHasBeenChanged(true);
    };

    const handleFilterWorldSailingNumber = (key: string, source: string[]) => {
        const filtered = FilterWorldSailingNumber(key, source);
        setCountryCodeList(filtered);
    };

    const handleCountryCodeSuggestionClick = (countryCode) => {
        setWorldSailingNumber(countryCode);
        setFormHasBeenChanged(true);
    };

    const renderCountryCodeList = (countryCodeList: string[]) => {
        return countryCodeList.map((countryCode) => {
            return <SailingNumberSuggestionItem onClick={() => { handleCountryCodeSuggestionClick(countryCode) }} key={countryCode}>{countryCode}</SailingNumberSuggestionItem>
        });
    };

    const verifyPhone = async (code) => {
        const response = await verifyPhoneNumber(code);
        if (response.success) {
            toast.success(t(translations.profile_page.update_profile.your_phone_number_has_been_verified));
            dispatch(actions.getUser());
            setShowPhoneVerifyModal(false);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Wrapper>
            <VerifyPhoneModal verifyPhone={verifyPhone} sendPhoneVerification={sendVerificationCode} showPhoneVerifyModal={showPhoneVerifyModal} setShowPhoneVerifyModal={setShowPhoneVerifyModal} />
            <SyrfFormTitle>{t(translations.profile_page.update_profile.private_user_details)}</SyrfFormTitle>
            <Tooltip title={t(translations.tip.email)}>
                <Form.Item
                    label={<SyrfFieldLabel>Email</SyrfFieldLabel>}
                    name="email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <SyrfInputField disabled />
                </Form.Item>
            </Tooltip>
            {renderVerifiedStatus(FIELD_VALIDATE.email)}

            <Tooltip title={t(translations.tip.address)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.address)}</SyrfFieldLabel>}
                    name="address"
                >
                    <PlacesAutocomplete
                        value={address}
                        onChange={(address) => { setAddress(address) }}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                            return (
                                <>
                                    <SyrfInputField
                                        {...getInputProps({
                                            placeholder: t(translations.profile_page.update_profile.search_places),
                                            className: 'location-search-input',
                                        })}
                                        value={address}

                                        allowClear
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
                            )
                        }}
                    </PlacesAutocomplete>
                </Form.Item>
            </Tooltip>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.date_of_birth)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.date_of_birth)}</SyrfFieldLabel>}
                            name="birthdate"
                            rules={[{ type: 'date' }, {
                                required: true,
                                message: t(translations.forms.birth_date_is_required)
                            }]}
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
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.world_sailing_number)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.world_sailing_number)}</SyrfFieldLabel>}
                            name="sailing_number"
                            style={{ position: 'relative' }}
                        >
                            <SyrfInputField value={worldSailingNumber} onChange={handleWorldSailingNumberChange}  onFocus={handleSuggestionVisible} onBlur={handleSuggestionBlur} />
                            <SailingNumberSuggestionContainer style={{ display: isSuggestionVisible ? 'block' : 'none' }}>
                                <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                                    {countryCodeList.length > 0 ?
                                        renderCountryCodeList(countryCodeList) :
                                        <SailingNumberSuggestionEmpty>No data found</SailingNumberSuggestionEmpty>
                                    }
                                </div>
                            </SailingNumberSuggestionContainer>
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.phone_number)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.phone_number)}</SyrfFieldLabel>}
                            name="phone_number"
                            rules={[{ type: 'string' }]}
                        >
                            <SyrfPhoneInput
                                inputProps={{ autoComplete: 'none' }}
                                inputClass="syrf-phone-number-input"
                                buttonClass="syrf-flag-dropdown"
                                placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                        </Form.Item>
                    </Tooltip>
                    {renderVerifiedStatus(FIELD_VALIDATE.phone)}
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.language)}>
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
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.profile_mode)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.profile_mode)}</SyrfFieldLabel>}
                            name="isPrivate"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren={'Private'} unCheckedChildren={'Public'} />
                        </Form.Item>
                    </Tooltip>
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

const StyledPLaceDropdown = styled(Menu)`
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    width: 100%;
`;

const SailingNumberSuggestionContainer = styled.div`
    position: absolute;
    top: 100%;
    padding: 4px 0px;
    border-radius: 4px;
    left: 0px;
    width: 100%;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    z-index: 20;
    transform: translateY(8px);
`;

const SailingNumberSuggestionItem = styled.div`
    padding: 4px 16px;
    background-color: #FFFFFF;
    z-index: 20;

    &:hover {
        background-color: #E6F7FF;
    }
`;

const SailingNumberSuggestionEmpty = styled.div`
    padding: 4px 16px;
    background-color: #FFFFFF;
    z-index: 20;
`;
