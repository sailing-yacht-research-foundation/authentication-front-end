import React from 'react';

import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import { languagesList } from 'utils/languages-util';
import { useState } from 'react';
import { updateProfile } from 'services/live-data-server/user';
import { useDispatch, useSelector } from 'react-redux';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';

export const SelectLanguage = (props) => {

    const { i18n } = useTranslation();

    const user = useSelector(selectUser);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(lng);

        if (isAuthenticated && user.attributes) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                attributes: {
                    picture: getUserAttribute(user,'picture'),
                    language: lng,
                    locale: getUserAttribute(user,'locale'),
                    bio: getUserAttribute(user,'bio'),
                    sailing_number: getUserAttribute(user,'sailing_number'),
                    birthdate: getUserAttribute(user,'birthdate'),
                    address: getUserAttribute(user,'address'),
                    phone_number: getUserAttribute(user,'phone_number'),
                    showed_tour: getUserAttribute(user, 'showed_tour'),
                }
            }
            await updateProfile(userData);
            dispatch(actions.getUser());
        }
    }

    const renderSelectedLanguage = (lng) => {
        if (isAuthenticated) {
            if (lng && languagesList[lng]){
                return languagesList[lng].nativeName;
            }


            return languagesList['en'].nativeName;
        }

        return languagesList[selectedLanguage] ?
            languagesList[selectedLanguage].nativeName
            : languagesList['en'].nativeName;
    }

    const setLanguague = (e, lang) => {
        e.preventDefault();
        changeLanguage(lang);
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'en');
                }}>
                    English
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'nl');
                }}>
                    Nederlands
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'de');
                }}>
                    Deutsch
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'zh');
                }}>
                    中文
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'es');
                }}>
                    Español
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'it');
                }}>
                    Italiano
                </a>
            </Menu.Item>
            <Menu.Item>
                <a rel="noopener noreferrer" href="/#" onClick={(e) => {
                    setLanguague(e, 'fr');
                }}>
                    Français
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                {renderSelectedLanguage(getUserAttribute(user, 'language'))} <DownOutlined />
            </a>
        </Dropdown>
    )
}