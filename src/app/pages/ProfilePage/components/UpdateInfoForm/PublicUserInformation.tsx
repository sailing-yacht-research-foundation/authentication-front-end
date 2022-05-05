import React from 'react';
import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfFormTitle,
    SyrfFormSelect,
    SyrfTextArea,
} from 'app/components/SyrfForm';
import { ChangeAvatar } from '../ChangeAvatar';
import { Select, Form, Row, Col, Tooltip } from 'antd';
import styled from 'styled-components';
import { localesList as countryList } from 'utils/languages-util';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { WATERSPORTS } from 'utils/constants';

export const PublicUserInformation = (props) => {

    const { authUser, cancelUpdateProfile } = props;

    const { t } = useTranslation();

    const renderCountryDropdownList = () => {
        const objectArray = Object.entries(countryList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value}</Select.Option>
        });
    }

    const renderInterestsList = () => {
        return WATERSPORTS.map((interest, index) => {
            return <Select.Option key={index} value={interest}>
                {'CRUISING' === interest ? <ItemAvatar src={`/sport-logos/${String(interest).toLowerCase()}.png`} />
                    : <ItemAvatar src={`/sport-logos/${String(interest).toLowerCase()}.svg`} />}
                {interest}</Select.Option>
        });
    }

    return (
        <Wrapper>
            <SyrfFormTitle>{t(translations.profile_page.update_profile.public_user_details)}</SyrfFormTitle>

            <ChangeAvatarWrapper>
                <ChangeAvatar cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            </ChangeAvatarWrapper>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.first_name)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.first_name)}</SyrfFieldLabel>}
                            name="first_name"
                            rules={[{ required: true, message: t(translations.forms.first_name_is_required) }, {
                                max: 15,
                                message: t(translations.forms.first_name_cannot_be_longer)
                            }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.last_name)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.last_name)}</SyrfFieldLabel>}
                            name="last_name"
                            rules={[{ required: true, message: t(translations.forms.last_name_is_required) }, {
                                max: 15,
                                message: t(translations.forms.last_name_cannot_be_longer)
                            }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Tooltip title={t(translations.tip.country)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.country)}</SyrfFieldLabel>}
                    name="country"
                    rules={[{ required: true }]}
                >
                    <SyrfFormSelect placeholder={t(translations.profile_page.update_profile.select_a_country)}
                        showSearch
                        filterOption={(input, option) => {
                            if (option) {
                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }

                            return false;
                        }}
                    >
                        {renderCountryDropdownList()}
                    </SyrfFormSelect>
                </Form.Item>
            </Tooltip>

            <Tooltip title={t(translations.tip.bio)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.biography)}</SyrfFieldLabel>}
                    name="bio"
                >
                    <SyrfTextArea placeholder={t(translations.profile_page.update_profile.biography_description)} />
                </Form.Item>
            </Tooltip>

            <Tooltip title={t(translations.tip.your_interests)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.interests)}</SyrfFieldLabel>}
                    name="interests"
                >
                    <SyrfFormSelect mode="multiple" maxTagCount={'responsive'}>
                        {renderInterestsList()}
                    </SyrfFormSelect>
                </Form.Item>
            </Tooltip>
        </Wrapper>
    );
}

const ChangeAvatarWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justitify-content: center;
    align-items:center;
    padding: 10px 0;
`;

const Wrapper = styled.div`
    background: #fff;
    padding: 50px 25px;
    border-radius: 10px;
`;

const ItemAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;