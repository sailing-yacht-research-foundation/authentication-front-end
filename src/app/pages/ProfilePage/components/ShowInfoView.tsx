import React from 'react';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import { Descriptions } from 'antd';

export const ShowInfoView = (props) => {
    const { authUser } = props;
    
    return (
        <Wrapper>
            <Descriptions title="User Info" layout="vertical">
                <Descriptions.Item label="Email">{ getUserAttribute(authUser, 'email') }</Descriptions.Item>
                <Descriptions.Item label="Name">{ getUserAttribute(authUser, 'name') }</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{ getUserAttribute(authUser, 'phone_number') }</Descriptions.Item>
                <Descriptions.Item label="Address">{ getUserAttribute(authUser, 'address') }</Descriptions.Item>
                <Descriptions.Item label="World Sailing Number">{ getUserAttribute(authUser, 'custom:sailing_number') }</Descriptions.Item>
                <Descriptions.Item label="Facebook">{ getUserAttribute(authUser, 'custom:facebook') }</Descriptions.Item>
                <Descriptions.Item label="Instagram">{ getUserAttribute(authUser, 'custom:instagram') }</Descriptions.Item>
                <Descriptions.Item label="Twitter">{ getUserAttribute(authUser, 'custom:twitter') }</Descriptions.Item>
                <Descriptions.Item label="Address">
                { getUserAttribute(authUser, 'address') }
                </Descriptions.Item>
            </Descriptions>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 30px;
    width: 100%;
`