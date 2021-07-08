import 'react-phone-input-2/lib/style.css';

import React, { useState } from 'react';
import { Form, Divider, Spin, Row, Col, DatePicker, Select, Menu, Dropdown } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';
import { ChangeAvatar } from './ChangeAvatar';
import {
    SyrfFieldLabel,
    SyrfFormWrapper,
    SyrfInputField,
    SyrfPhoneInput,
    SyrfSubmitButton,
    SyrfFormTitle,
    SyrfFormSelect,
} from 'app/components/SyrfForm';
import { media } from 'styles/media';
import { languagesList } from 'utils/languages-util';
import PlacesAutocomplete from 'react-places-autocomplete';

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

    const [address, setAddress] = useState<string>(getUserAttribute(authUser, 'address'));

    const onFinish = (values) => {
        const { name, phone_number, sailing_number, birthdate, language } = values;

        setIsUpdatingProfile(true);

        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                name: name,
                phone_number: '+' + phone_number,
                address: address,
                birthdate: birthdate ? birthdate.format("YYYY-MM-DD") : moment('2002-01-01').format("YYYY-MM-DD"),
                'custom:sailing_number': sailing_number,
                'custom:language': language
            }).then(response => {
                setIsUpdatingProfile(false);
                toast.success('Your profile has been successfully updated!');
                props.cancelUpdateProfile();
            }).catch(error => {
                toast.error(error.message);
                setIsUpdatingProfile(false);
            })
        }).catch(error => {
            toast.error(error.message);
            setIsUpdatingProfile(false);
        })
    }

    const renderLanguegesDropdownList = () => {
        const objectArray = Object.entries(languagesList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value.nativeName}</Select.Option>
        });
    }

    return (
        <Wrapper>
            <SyrfFormWrapper>
                <ChangeAvatarWrapper>
                    <ChangeAvatar cancelUpdateProfile={props.cancelUpdateProfile} authUser={authUser} />
                </ChangeAvatarWrapper>
                <Spin spinning={isUpdatingProfile} tip="Updating your profile...">
                    <SyrfFormTitle>Change User Information here</SyrfFormTitle>
                    <Form
                        layout="vertical"
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
                            language: getUserAttribute(authUser, 'custom:language')
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>Email</SyrfFieldLabel>}
                                    name="email"
                                    rules={[{ required: true, type: 'email' }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>Name</SyrfFieldLabel>}
                                    name="name"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfInputField />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item
                            label={<SyrfFieldLabel>Address</SyrfFieldLabel>}
                            name="address"
                        >

                            <PlacesAutocomplete
                                value={address}
                                onChange={(address) => { setAddress(address) }}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <>
                                        <SyrfInputField
                                            {...getInputProps({
                                                placeholder: 'Search Places ...',
                                                className: 'location-search-input',
                                            })}
                                            value={address}
                                        />
                                        {suggestions.length > 0 && <StyledPLaceDropdown>
                                            {suggestions.map((suggestion) => {
                                                console.log();
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
                                    label={<SyrfFieldLabel>Date Of Birth</SyrfFieldLabel>}
                                    name="birthdate"
                                    rules={[{ type: 'date', required: true }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        // defaultValue={moment('2002-01-01')}
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
                                    label={<SyrfFieldLabel>World Sailing Number</SyrfFieldLabel>}
                                    name="sailing_number"
                                >
                                    <SyrfInputField />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>Phone Number</SyrfFieldLabel>}
                                    name="phone_number"
                                    rules={[{ type: 'string' }]}
                                >
                                    <SyrfPhoneInput
                                        inputClass="syrf-phone-number-input"
                                        buttonClass="syrf-flag-dropdown"
                                        placeholder="Enter phone number" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label="Language"
                                    name="language"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfFormSelect placeholder={'Select a Language'}
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

                        <Divider />

                        <Form.Item>
                            <SyrfSubmitButton type="primary" htmlType="submit">
                                Update Information
                            </SyrfSubmitButton>
                        </Form.Item>

                    </Form>
                </Spin >
            </SyrfFormWrapper >
        </Wrapper >
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    width: 100%;
    display:flex;
    justify-content: center;
`;

const ChangeAvatarWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justitify-content: center;
    align-items:center;
    padding: 50px 0;

    ${media.medium`
        position: absolute;
        left: 50px;
        top: 70px;
    `}
`;

const StyledPLaceDropdown = styled(Menu)`
    position: absolute;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    width: 100%;
`;