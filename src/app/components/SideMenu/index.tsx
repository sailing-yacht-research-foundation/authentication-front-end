import React from 'react';

import { Menu } from 'antd';
import { Logo } from '../NavBar/Logo';
import {
    UserOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import { useHistory } from 'react-router';

export const SideMenu = (props) => {
    const history = useHistory();

    return (
        <Sider trigger={null} collapsible style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            zIndex: 2
        }}>
            <Logo type='light' />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Deals
                </Menu.Item>

                <Menu.SubMenu key="sub2" icon={<UserOutlined />} title="Profile">
                    <Menu.Item key="9">Update Profile</Menu.Item>
                    <Menu.Item onClick={()=> history.push('/profile/change-password')} key="10">Change Password</Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="3" icon={<UploadOutlined />}>
                    App Connections
                </Menu.Item>

                <Menu.Item key="4" icon={<UploadOutlined />}>
                    Organizational Memberships
                </Menu.Item>

                <Menu.Item key="5" icon={<UploadOutlined />}>
                    Settings
                </Menu.Item>
            </Menu>
        </Sider>
    )
}