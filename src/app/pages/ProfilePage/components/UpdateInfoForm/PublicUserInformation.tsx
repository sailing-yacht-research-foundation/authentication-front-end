import React from 'react';
import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfFormTitle,
    SyrfFormSelect,
    SyrfTextArea,
} from 'app/components/SyrfForm';
import { ChangeAvatar } from '../ChangeAvatar';
import { Select, Switch, Form, Row, Col } from 'antd';
import styled from 'styled-components';
import { localesList as countryList } from 'utils/languages-util';

export const PublicUserInformation = (props) => {

    const { authUser, cancelUpdateProfile } = props;

    const renderCountryDropdownList = () => {
        const objectArray = Object.entries(countryList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={key.toLowerCase()}>{value}</Select.Option>
        });
    }

    return (
        <Wrapper>
            <SyrfFormTitle>Public User Details</SyrfFormTitle>

            <ChangeAvatarWrapper>
                <ChangeAvatar cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            </ChangeAvatarWrapper>

            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>First Name</SyrfFieldLabel>}
                        name="first_name"
                        rules={[{ required: true, max: 15 }]}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>Last Name</SyrfFieldLabel>}
                        name="last_name"
                        rules={[{ required: true, max: 15 }]}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label={<SyrfFieldLabel>Country</SyrfFieldLabel>}
                name="country"
                rules={[{ required: true }]}
            >
                <SyrfFormSelect placeholder={'Select a country'}
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
                label={<SyrfFieldLabel>Biography</SyrfFieldLabel>}
                name="bio"
            >
                <SyrfTextArea placeholder={'e.g. Olympic 29er Champion and meteorology nerd.'} />
            </Form.Item>

            {/* <Form.Item
                label={<SyrfFieldLabel>Share social media</SyrfFieldLabel>}
                name="share_social"
                valuePropName="checked"
            >
                <Switch defaultChecked checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item> */}
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