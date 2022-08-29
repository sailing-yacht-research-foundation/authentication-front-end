import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Form, Select, Divider, Checkbox, Spin, Row, Col } from 'antd';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { languagesList, localesList } from 'utils/languages-util';
import { SyrfFormButton } from 'app/components/SyrfForm';
import * as eulaVersions from 'app/pages/EULAPage/components/eulaVersions';
import * as privacyPolicyVersions from 'app/pages/PrivacyPolicyPage/components/privacyPolicyVersions';
import { translations } from 'locales/translations';
import { register } from 'services/live-data-server/auth';
import { EulaInterface } from 'types/Eula';
import { eulaVersionsFilter } from 'utils/eula';
import { PrivacyPolicyInterface } from 'types/PrivacyPolicy';
import { privacypolicyVersionsFilter } from 'utils/privacy-policy';
import styled from 'styled-components';
import { AuthCode } from 'utils/constants';
import { InputPasswordWithNoBrowserSupportAttributes, InputWithNoBrowserSupportAttributes } from 'app/components/SyrfGeneral';

const { Option } = Select;

export const SignupForm = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const eula = React.useRef<EulaInterface>(eulaVersionsFilter(eulaVersions.versionList)[0])?.current;

    const privacyPolicy = React.useRef<PrivacyPolicyInterface>(privacypolicyVersionsFilter(privacyPolicyVersions.versionList)[0]).current;

    const history = useHistory();

    const { t } = useTranslation();

    const onFinish = async (values) => {
        const { email, password, locale, language, first_name, last_name } = values;

        setIsSigningUp(true);

        const response: any = await register({
            firstName: first_name,
            lastName: last_name,
            username: email,
            email: email,
            attributes: {
                locale: locale,
                language: language,
                picture: String(Math.floor(Math.random() * 20) + 1),
            },
            enabled: true,
            credentials: [{ type: "password", value: password, temporary: false }],
            eulaVersion: eula.version,
            privacyPolicyVersion: privacyPolicy.version
        });

        setIsSigningUp(false);

        if (response.success) {
            history.push('/verify-account?email='+ email);
            toast.info(t(translations.signup_page.register_success));
        } else {
            if (response.error?.response.data.errorCode === AuthCode.USER_ALREADY_EXISTS) { // E015 means the user already exists
                toast.error(t(translations.signup_page.user_already_exists));
            } else {
                toast.error(t(translations.signup_page.cannot_sign_you_up_at_the_moment));
            }
        }
    }

    const renderLocaleDropdownList = () => {
        const objectArray = Object.entries(localesList);

        return objectArray.map(([key, value]) => {
            return <Option key={key} value={key.toLowerCase()}>{value}</Option>
        });
    }

    const renderLanguegesDropdownList = () => {
        const objectArray = Object.entries(languagesList);

        return objectArray.map(([key, value]) => {
            return <Option key={key} value={key.toLowerCase()}>{value.nativeName}</Option>
        });
    }

    return (
        <Wrapper>
            <Spin spinning={isSigningUp} tip={t(translations.signup_page.signing_you_up)}>
                <Form
                    layout={'vertical'}
                    name="basic"
                    initialValues={{
                        language: 'en',
                        email: '',
                        name: '',
                        password: '',
                        locale: 'us'
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                            type: 'email', message: t(translations.forms.email_must_be_valid)
                        }, {
                            pattern: /^\S+$/,
                            message: t(translations.forms.must_not_contain_blank, { field: t(translations.general.email) })
                        },]}
                    >
                        <InputWithNoBrowserSupportAttributes />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label={t(translations.general.first_name)}
                                name="first_name"
                                rules={[
                                    { required: true, message: t(translations.forms.please_fill_out_this_field) },
                                    { max: 15, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 15 }) }]}
                            >
                                <InputWithNoBrowserSupportAttributes />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label={t(translations.general.last_name)}
                                name="last_name"
                                rules={[
                                    { required: true, message: t(translations.forms.please_fill_out_this_field) },
                                    { max: 15, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 15 }) }]}
                            >
                                <InputWithNoBrowserSupportAttributes />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={t(translations.general.password)}
                        name="password"
                        rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                            pattern: /^\S+$/,
                            message: t(translations.forms.must_not_contain_blank, { field: t(translations.general.password) })
                        }, {
                            max: 16, min: 8, message: t(translations.forms.please_input_between, { min: 8, max: 16, field: t(translations.general.password) })
                        }]}
                    >
                        <InputPasswordWithNoBrowserSupportAttributes />
                    </Form.Item>

                    <Form.Item
                        label={t(translations.signup_page.password_confirmation)}
                        name="passwordConfirmation"
                        rules={[
                            {
                                required: true,
                                message: t(translations.signup_page.please_confirm_your_password),
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t(translations.signup_page.the_two_passwords_that_you_entered_do_not_match)));
                                },
                            }),
                        ]}
                    >
                        <InputPasswordWithNoBrowserSupportAttributes />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        label={t(translations.general.country)}
                        name="locale"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder={t(translations.signup_page.select_a_country)}
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
                                renderLocaleDropdownList()
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t(translations.signup_page.language)}
                        name="language"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder={t(translations.signup_page.select_a_language)}
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
                        </Select>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="eula_agree" valuePropName="checked" rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t(translations.signup_page.you_should_accept_our_eula))),
                        },
                    ]}>
                        <Checkbox>Agree to <Link to="eula">EULA</Link></Checkbox>
                    </Form.Item>

                    <Form.Item name="pp_agree" valuePropName="checked" rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t(translations.signup_page.you_must_agree_to_our_privacy_policy))),
                        },
                    ]}>
                        <Checkbox value={1}>{t(translations.signup_page.agree_to)}  <Link to="privacy-policy">{t(translations.signup_page.privacy_policy)}</Link></Checkbox>
                    </Form.Item>

                    <Form.Item name="email_not_shared" valuePropName="checked" rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t(translations.signup_page.you_must_acknowledge_that_email_provided_will_not_be_a_shared_email))),
                        },
                    ]}>
                        <Checkbox value={1}>{t(translations.signup_page.agree_that_my_provided_email_address_is_only_shared_by_me)}</Checkbox>
                    </Form.Item>

                    <Form.Item name="over_18" valuePropName="checked" rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t(translations.signup_page.you_should_make_sure_you_are_18_or_over))),
                        },
                    ]}>
                        <Checkbox>{t(translations.signup_page.agree_over_18)}</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.signup_page.signup)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    z-index: 10;
    background: rgba(255,255,255,.8);
    padding: 30px;
    border-radius: 10px;
    // height: 500px;
    // overflow-y: scroll;
`;
