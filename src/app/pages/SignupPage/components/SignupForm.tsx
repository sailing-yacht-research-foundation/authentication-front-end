import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Input, Form, Select, Divider, DatePicker, Checkbox, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { LANGUAGE_BY_LOCALE as locales } from 'utils/locale-list';
import PhoneInput from 'react-phone-input-2';
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

    const [countryCode, setCountryCode] = useState<string>('us');

    const onFinish = (values) => {
        const { email, name, password, locale, phone_number, sailing_number, address, facebook, instagram, twitter, birthdate } = values;

        setIsSigningUp(true);

        Auth.signUp({
            username: email,
            password: password,
            attributes: {
                name: name,
                locale: locale,
                phone_number: '+' + phone_number,
                address: address,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                'custom:sailing_number': String(sailing_number).toLowerCase(),
                'custom:facebook': facebook,
                'custom:instagram': instagram,
                'custom:twitter': twitter,
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

    const onLocaleSelected = (locale) => {
        setCountryCode(locale);
    }

    const renderLocaleDropdownList = () => {
        const objectArray = Object.entries(locales);

        return objectArray.map(([key, value]) => {
            return <Option key={key} value={key.toLowerCase()}>{value}</Option>
        });
    }

    return (
        <Spin spinning={isSigningUp} tip="Signing you up...">
            <Form
                layout={'vertical'}
                name="basic"
                initialValues={{ remember: true }}
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
                    label="Country / Language"
                    name="locale"
                    rules={[{ required: true }]}
                >
                    <Select placeholder={'Select a language'}
                        showSearch
                        onSelect={onLocaleSelected}
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

                <Divider />

                <Form.Item
                    label="Phone Number"
                    name="phone_number"
                    rules={[{ type: 'string' }]}
                >
                    <PhoneInput country={countryCode} inputClass="phone-number-input"
                        placeholder="Enter phone number" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Date Of Birth"
                    name="birthdate"
                    rules={[{ type: 'date' }]}
                >
                    <DatePicker
                        ref="datePickerRef"
                        defaultValue={moment('2002-01-01')}
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
