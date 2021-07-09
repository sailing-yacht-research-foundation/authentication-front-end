import React from 'react';

import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import Auth from '@aws-amplify/auth';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { languagesList } from 'utils/languages-util';
import { useState } from 'react';

export const SelectLanguage = (props) => {

    const { i18n } = useTranslation();

    const user = useSelector(selectUser);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const { actions } = UseLoginSlice();

    const dispatch = useDispatch();

    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    React.useEffect(() => {
        changeLanguage(getUserAttribute(user, 'custom:language'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:language': lng,
            }).then(response => {
                Auth.currentAuthenticatedUser()
                    .then(user => dispatch(actions.setUser(JSON.parse(JSON.stringify(user)))))
                    .catch(error => { });
            }).catch(error => { })
        }).catch(error => {
        })
    }

    const renderSelectedLanguage = (lng) => {
        if (isAuthenticated) {
            if (lng && languagesList[lng])
                return languagesList[lng].nativeName;

            return languagesList['en'].nativeName;
        }

        return languagesList[selectedLanguage] ?
            languagesList[selectedLanguage].nativeName
            : languagesList['en'].nativeName;
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
                    Nederlands
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('de');
                }}>
                    Deutsch
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('zh');
                }}>
                    中文
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('es');
                }}>
                    español
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={(e) => {
                    e.preventDefault();
                    changeLanguage('it');
                }}>
                    Italiano
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                {renderSelectedLanguage(getUserAttribute(user, 'custom:language'))} <DownOutlined />
            </a>
        </Dropdown>
    )
}