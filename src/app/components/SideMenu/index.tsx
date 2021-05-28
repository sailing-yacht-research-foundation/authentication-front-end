import React from 'react';

import { Menu } from 'antd';
import { Logo } from '../NavBar/Logo';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';

export const SideMenu = (props) => {
    return (
        <Sider trigger={null} collapsible style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            zIndex: 2
        }}>
            <Logo type='light'/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Deals
            </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    Profile
            </Menu.Item>
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