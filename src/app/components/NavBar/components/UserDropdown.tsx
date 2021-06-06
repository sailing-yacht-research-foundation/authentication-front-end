import * as React from 'react';
import styled from 'styled-components/macro';
import { Menu, Dropdown, Image } from 'antd';
import { DownOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getProfilePicture, getUserAttribute } from 'utils/user-utils';
import { useHistory } from 'react-router-dom';

export const UserDropdown = (props) => {

    const history = useHistory();

    const authUser = useSelector(selectUser);

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => history.push('/profile')} icon={<UserOutlined />}>
                Update Profile
            </Menu.Item>
            <Menu.Item onClick={() => props.logout()} key="2" icon={<LockOutlined />}>
                Sign Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <UserDropdownWrapper>
                <AvatarWrapper>
                    <Image src={getProfilePicture(authUser)} />
                </AvatarWrapper>
                <UserNameWrapper>
                    <UserName className="ant-dropdown-link">{getUserAttribute(authUser, 'name')}</UserName>
                    <DownOutlined />
                </UserNameWrapper>
            </UserDropdownWrapper>
        </Dropdown>
    )
}

const UserDropdownWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    align-items: center;
`;

const AvatarWrapper = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 5px;
    overflow: hidden;
`;

const UserNameWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const UserName = styled.span`
    margin-right: 5px;
`;