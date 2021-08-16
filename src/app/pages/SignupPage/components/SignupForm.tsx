import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Input, Form, Select, Divider, DatePicker, Checkbox, Spin, Row, Col } from 'antd';
import { Auth } from 'aws-amplify';
import { languagesList, localesList } from 'utils/languages-util';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const { Option } = Select;

const format = "DD.MM.YYYY HH:mm";

const disabledDates = [
    {
        start: "29.12.2002 13:00",
        end: moment().format(format)
    },
];

export const SignupForm = () => {
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const history = useHistory();

    const { t } = useTranslation();

    const onFinish = (values) => {
        const { email, password, locale, language, birthdate, first_name, last_name } = values;

        setIsSigningUp(true);

        Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: String(first_name) + ' ' + String(last_name),
                locale: locale,
                'custom:language': language,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                picture: String(Math.floor(Math.random() * 20) + 1),
                'custom:first_name': first_name,
                'custom:last_name': last_name
            }
        }).then(response => {
            let registerSuccess = !!response.user;

            setIsSigningUp(false);

            if (registerSuccess) {
                history.push('/verify-account', {
                    state: {
                        email: response.user?.getUsername()
                    }
                });
            }
        }).catch(err => {
            setIsSigningUp(false);

            if (err.code) {
                toast.error(err.message)
            } else {
                toast.error(t(translations.signup_page.cannot_sign_you_up_at_the_moment));
            }
        })
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
        <Spin spinning={isSigningUp} tip={t(translations.signup_page.signing_you_up)}>
            <Form
                layout={'vertical'}
                name="basic"
                initialValues={{
                    language: 'en',
                    email: '',
                    name: '',
                    password: '',
                    locale: 'us',
                    birthdate: moment('2002-01-01 00:00:00').utcOffset('+0000')
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t(translations.signup_page.first_name)}
                            name="first_name"
                            rules={[{ required: true, max: 15 }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t(translations.signup_page.last_name)}
                            name="last_name"
                            rules={[{ required: true, max: 15 }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={t(translations.signup_page.password)}
                    name="password"
                    rules={[{ required: true, max: 16, min: 8 }]}
                >
                    <Input.Password />
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={t(translations.signup_page.date_of_birth)}
                    name="birthdate"
                    rules={[{ type: 'date', required: true }]}
                >
                    <DatePicker
                        ref="datePickerRef"
                        showToday={false}
                        style={{ width: '100%' }}
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

                <Divider />

                <Form.Item
                    label={t(translations.signup_page.country)}
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

                <Form.Item>
                    <SyrfFormButton type="primary" htmlType="submit">
                    {t(translations.signup_page.signup)}
                    </SyrfFormButton>
                </Form.Item>
            </Form>
        </Spin>
    );

}
