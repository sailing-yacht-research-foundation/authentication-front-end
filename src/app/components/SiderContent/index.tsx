import React from 'react';

import { Menu } from 'antd';
import { ReactComponent as Logo } from './assets/my-sailing.svg';
import {
  UserOutlined,
  MoneyCollectOutlined,
  CrownOutlined,
  HeatMapOutlined,
  SlidersOutlined,
  ApiOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';

export const SiderContent = (props) => {
  const history = useHistory();

  return (
    <SiderWrapper>
      <Logo style={{ margin: '20px auto', display:'block' }}/>
      <SyrfMenu mode="inline" defaultSelectedKeys={['1']}>
        <SyrfMenuItem title={'Deals'} key="1" icon={<MoneyCollectOutlined />}>
          Deals
        </SyrfMenuItem>

        <SyrfSubmenu key="sub2" icon={<UserOutlined />} title="Profile">
          <SyrfMenuItem title={'My Profile'} key="7" icon={<ProfileOutlined />} onClick={() => history.push('/profile')}>My Profile</SyrfMenuItem>
          <SyrfMenuItem title={'Change Password'} icon={<LockOutlined />} onClick={() => history.push('/profile/change-password')} key="8">Change Password</SyrfMenuItem>
          <SyrfMenuItem title={'Notification settings'} icon={<BellOutlined />} onClick={() => history.push('/profile')} key="9">Notification settings</SyrfMenuItem>
          <SyrfMenuItem title={'Profile settings'} icon={<SettingOutlined />} onClick={() => history.push('/profile')} key="10">Profile settings</SyrfMenuItem>
        </SyrfSubmenu>

        <SyrfMenuItem key="3" title={'App Connections'} icon={<ApiOutlined />}>
          App Connections
        </SyrfMenuItem>

        <SyrfMenuItem key="4" title={'Organizational Memberships'} icon={<CrownOutlined />}>
          Organizational Memberships
        </SyrfMenuItem>

        <SyrfMenuItem key="5" title={'My Data'} icon={<HeatMapOutlined />}>
          My Data
        </SyrfMenuItem>

        <SyrfMenuItem key="6" title={'Test Data'} icon={<SlidersOutlined />}>
          Test Data
        </SyrfMenuItem>
      </SyrfMenu>
    </SiderWrapper>
  )
}

const SiderWrapper = styled.div`
  position: fixed;
  width: 300px;
  background: ${StyleConstants.MAIN_TONE_COLOR};
`;

const SyrfMenu = styled(Menu)`
    background: ${StyleConstants.MAIN_TONE_COLOR};
    color: #fff;
    font-weight: 500;
    height: 100vh;
`;

const SyrfSubmenu = styled(Menu.SubMenu)`
    background: ${StyleConstants.MAIN_TONE_COLOR} !important;
    color: #fff;

    ul {
        background: ${StyleConstants.MAIN_TONE_COLOR} !important;
        color: #fff;
    }
`;

const SyrfMenuItem = styled(Menu.Item)`
    height: 50px !important;
    line-height: 50px !important;
`