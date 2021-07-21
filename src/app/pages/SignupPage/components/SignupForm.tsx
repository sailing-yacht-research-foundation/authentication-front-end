import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Input, Form, Select, Divider, DatePicker, Checkbox, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { languagesList, localesList } from 'utils/languages-util';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { SyrfFormButton } from 'app/components/SyrfForm';

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

    const onFinish = (values) => {
        const { email, name, password, locale, language, birthdate } = values;

        setIsSigningUp(true);

        Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                locale: locale,
                'custom:language': language,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                picture: String(Math.floor(Math.random() * 20) + 1)
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
                toast.error("Cannot sign you up at the moment.");
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
        <Spin spinning={isSigningUp} tip="Signing you up...">
            <Form
                layout={'vertical'}
                name="basic"
                initialValues={{
                    language: 'en',
                    email: '',
                    name: '',
                    password: '',
                    locale: 'us',
                    birthdate: moment('2002-01-01 00:00:00')
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

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, max: 16, min: 8 }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Password Confirmation"
                    name="passwordConfirmation"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Date Of Birth"
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
                    label="Country"
                    name="locale"
                    rules={[{ required: true }]}
                >
                    <Select placeholder={'Select a country'}
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
                    label="Language"
                    name="language"
                    rules={[{ required: true }]}
                >
                    <Select placeholder={'Select a Language'}
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
                            value ? Promise.resolve() : Promise.reject(new Error('You should accept our EULA.')),
                    },
                ]}>
                    <Checkbox>Agree to <Link to="eula">EULA</Link></Checkbox>
                </Form.Item>

                <Form.Item name="pp_agree" valuePropName="checked" rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('You must agree to our privacy policy.')),
                    },
                ]}>
                    <Checkbox value={1}>Agree to <Link to="privacy-policy">Privacy policy</Link></Checkbox>
                </Form.Item>

                <Form.Item name="email_not_shared" valuePropName="checked" rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('You must acknowledge that email provided will not be a shared email.')),
                    },
                ]}>
                    <Checkbox value={1}>Acknowledge that email provided will not be a shared email (one email per user).</Checkbox>
                </Form.Item>

                <Form.Item>
                    <SyrfFormButton type="primary" htmlType="submit">
                        Sign Up
                    </SyrfFormButton>
                </Form.Item>
            </Form>
        </Spin>
    );

}
