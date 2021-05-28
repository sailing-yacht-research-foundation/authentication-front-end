import React, { memo } from 'react';
import styled from 'styled-components/macro';

import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export const SelectLanguage = (props) => {
    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    English
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Dutch
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    German
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                English <DownOutlined />
            </a>
        </Dropdown>
    )
}