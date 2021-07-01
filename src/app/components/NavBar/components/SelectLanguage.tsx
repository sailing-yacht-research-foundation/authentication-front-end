import React from 'react';

import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import Auth from '@aws-amplify/auth';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { languagesList } from 'utils/languages-util';

export const SelectLanguage = (props) => {

    const { i18n } = useTranslation();

    const user = useSelector(selectUser);

    const { actions } = UseLoginSlice();

    const dispatch = useDispatch();

    React.useEffect(() => {
        changeLanguage(getUserAttribute(user, 'custom:language'))
    }, []);

    const changeLanguage = (lng) => {
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:language': lng,
            }).then(response => {
                i18n.changeLanguage(lng);
                Auth.currentAuthenticatedUser()
                    .then(user => dispatch(actions.setUser(JSON.parse(JSON.stringify(user)))))
                    .catch(error => { });
            }).catch(error => {

            })
        }).catch(error => {
        })
    }

    const renderSelectedLanguage = (lng) => {
        if (lng)
            return languagesList[lng].name;
        
        return languagesList['en'].name;
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('en');
                }}>
                    English
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('nl');
                }}>
                    Dutch
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('de');
                }}>
                    German
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('zh');
                }}>
                    Chinese
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('es');
                }}>
                    Spanish
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('it');
                }}>
                    Italian
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {renderSelectedLanguage(getUserAttribute(user, 'custom:language'))} <DownOutlined />
            </a>
        </Dropdown>
    )
}