import * as React from 'react';
import styled from 'styled-components/macro';
import { Menu, Dropdown, Image } from 'antd';
import { DownOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getProfilePicture } from 'utils/user-utils';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const UserDropdown = (props) => {

    const history = useHistory();

    const authUser = useSelector(selectUser);

    const { t } = useTranslation();

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => history.push('/profile')} icon={<UserOutlined />}>
                {t(translations.home_page.nav.update_profile)}
            </Menu.Item>
            <Menu.Item onClick={() => props.logout()} key="2" icon={<LockOutlined />}>
                {t(translations.home_page.nav.logout)}
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <UserDropdownWrapper>
                <AvatarWrapper>
                    <Image style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} src={getProfilePicture(authUser)} />
                </AvatarWrapper>
                <UserNameWrapper>
                    <UserName className="ant-dropdown-link">{authUser.firstName} {authUser.lastName}</UserName>
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