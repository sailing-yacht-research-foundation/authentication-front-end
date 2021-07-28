import React from 'react';
import {
    SyrfFieldLabel,
    SyrfInputField,
    SyrfSubmitButton,
    SyrfFormTitle,
} from 'app/components/SyrfForm';
import { ChangeAvatar } from '../ChangeAvatar';
import { Select, Switch, Form } from 'antd';
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
        <>
            <SyrfFormTitle>Public User Details</SyrfFormTitle>

            <ChangeAvatarWrapper>
                <ChangeAvatar cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            </ChangeAvatarWrapper>

            <Form.Item
                label={<SyrfFieldLabel>Name</SyrfFieldLabel>}
                name="name"
                rules={[{ required: true }]}
            >
                <SyrfInputField />
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>Country</SyrfFieldLabel>}
                name="country"
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
                    {renderCountryDropdownList()}
                </Select>
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>Share social media</SyrfFieldLabel>}
                name="share_social"
                valuePropName="checked"
            >
                <Switch defaultChecked checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item>
                <SyrfSubmitButton type="primary" htmlType="submit">
                    Update Information
                </SyrfSubmitButton>
            </Form.Item>

        </>
    );
}

const ChangeAvatarWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justitify-content: center;
    align-items:center;
    padding: 50px 0;
`;