import React from 'react';
import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfFormTitle,
    SyrfFormSelect,
    SyrfTextArea,
} from 'app/components/SyrfForm';
import { ChangeAvatar } from '../ChangeAvatar';
import { Select, Form, Row, Col } from 'antd';
import styled from 'styled-components';
import { localesList as countryList } from 'utils/languages-util';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ReactTooltip from 'react-tooltip';

export const PublicUserInformation = (props) => {

    const { authUser, cancelUpdateProfile } = props;

    const { t } = useTranslation();

    const renderCountryDropdownList = () => {
        const objectArray = Object.entries(countryList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value}</Select.Option>
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
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.first_name)}</SyrfFieldLabel>}
                        name="first_name"
                        rules={[{ required: true, message: t(translations.forms.first_name_is_required) }, {
                            max: 15,
                            message: t(translations.forms.first_name_cannot_be_longer)
                        }]}
                        data-tip={t(translations.tip.first_name)}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.last_name)}</SyrfFieldLabel>}
                        name="last_name"
                        rules={[{ required: true, message: t(translations.forms.last_name_is_required) }, {
                            max: 15,
                            message: t(translations.forms.last_name_cannot_be_longer)
                        }]}
                        data-tip={t(translations.tip.last_name)}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.country)}</SyrfFieldLabel>}
                name="country"
                data-tip={t(translations.tip.country)}
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

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.biography)}</SyrfFieldLabel>}
                name="bio"
                data-tip={t(translations.tip.bio)}
            >
                <SyrfTextArea placeholder={t(translations.profile_page.update_profile.biography_description)} />
            </Form.Item>
            <ReactTooltip />
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