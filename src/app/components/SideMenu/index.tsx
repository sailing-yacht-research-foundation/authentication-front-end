import React from 'react';

import { Menu } from 'antd';
import { Logo } from '../NavBar/Logo';
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
import Sider from 'antd/lib/layout/Sider';
import { useHistory } from 'react-router';
import { StyleConstants } from 'styles/StyleConstants';

export const SideMenu = (props) => {
    const history = useHistory();

    return (
        <Sider trigger={null} width={StyleConstants.SIDE_BAR_WITH} collapsible style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            zIndex: 2
        }}>
            <Logo type='light' />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item title={'Deals'} key="1" icon={<MoneyCollectOutlined />}>
                    Deals
                </Menu.Item>

                <Menu.SubMenu key="sub2" icon={<UserOutlined />} title="Profile">
                    <Menu.Item title={'My Profile'} key="7" icon={<ProfileOutlined />} onClick={()=> history.push('/profile')}>My Profile</Menu.Item>
                    <Menu.Item title={'Change Password'} icon={<LockOutlined />} onClick={()=> history.push('/profile/change-password')} key="8">Change Password</Menu.Item>
                    <Menu.Item title={'Notification settings'} icon={<BellOutlined />} onClick={()=> history.push('/profile')} key="9">Notification settings</Menu.Item>
                    <Menu.Item title={'Profile settings'} icon={<SettingOutlined />} onClick={()=> history.push('/profile')} key="10">Profile settings</Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="3" title={'App Connections'} icon={<ApiOutlined />}>
                    App Connections
                </Menu.Item>

                <Menu.Item key="4" title={'Organizational Memberships'} icon={<CrownOutlined />}>
                    Organizational Memberships
                </Menu.Item>

                <Menu.Item key="5" title={'My Data'} icon={<HeatMapOutlined />}>
                    My Data
                </Menu.Item>

                <Menu.Item key="6" title={'Test Data'} icon={<SlidersOutlined />}>
                    Test Data
                </Menu.Item>
            </Menu>
        </Sider>
    )
}