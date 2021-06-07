import 'react-phone-number-input/style.css';

import React, { useState } from 'react';
import { Input, Form, Button, Divider, DatePicker, Spin, Space } from 'antd';
import PhoneInput from 'react-phone-number-input';
import moment from 'moment';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';

const layout = {
    labelCol: { xs: { span: 24 }, sm: { span: 24 }, lg: { span: 8 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 8 }, lg: { span: 8 } },
};

const tailLayout = {
    wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 12, offset: 8 }, lg: { span: 12, offset: 8 } }
};

const format = "DD.MM.YYYY HH:mm";

const disabledDates = [
    {
        start: "29.12.2002 13:00",
        end: moment().format(format)
    },
];

export const UpdateInfo = (props) => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

    const { authUser } = props;

    const onFinish = (values) => {
        const { name, phone_number, sailing_number, address, facebook, instagram, twitter, birthdate } = values;

        setIsUpdatingProfile(true);

        Auth.currentAuthenticatedUser().then(user => {
            setIsUpdatingProfile(false);
            Auth.updateUserAttributes(user, {
                name: name,
                phone_number: phone_number,
                address: address,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                'custom:sailing_number': sailing_number,
                'custom:facebook': facebook,
                'custom:instagram': instagram,
                'custom:twitter': twitter,
            }).then(response => {
                toast.success('Your profile has been successfully updated!');
                props.cancelUpdateProfile();
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            toast.error(error.message);
            setIsUpdatingProfile(false);
        })
    }

    return (
        <Wrapper>
            <Spin spinning={isUpdatingProfile} tip="Updating your profile...">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        email: getUserAttribute(authUser, 'email'),
                        name: getUserAttribute(authUser, 'name'),
                        phone_number: getUserAttribute(authUser, 'phone_number'),
                        address: getUserAttribute(authUser, 'address'),
                        birthdate: moment(getUserAttribute(authUser, 'birthdate')),
                        sailing_number: getUserAttribute(authUser, 'custom:sailing_number'),
                        facebook: getUserAttribute(authUser, 'custom:facebook'),
                        instagram: getUserAttribute(authUser, 'custom:instagram'),
                        twitter: getUserAttribute(authUser, 'custom:twitter'),
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        label="Phone Number"
                        name="phone_number"
                        rules={[{ type: 'string' }]}
                    >
                        <PhoneInput className="ant-input"
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
                            style={{ width: '100%' }}
                            defaultValue={moment('2002-01-01')}
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

                    <Form.Item
                        label="World Sailing Number"
                        name="sailing_number"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Facebook profile"
                        name="facebook"
                        rules={[{ type: 'url' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Instagram profile"
                        name="instagram"
                        rules={[{ type: 'url' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Twitter profile"
                        name="twitter"
                        rules={[{ type: 'url' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Divider />

                    <Form.Item {...tailLayout}>
                        <Space size={15}>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>

                            <Button htmlType="button" onClick={(e) => {
                                e.preventDefault();
                                props.cancelUpdateProfile();
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </Spin>
        </Wrapper>
    )
}

const Wrapper = styled.div`
margin-top: 50px;
width: 100%;
`