/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { Menu, Dropdown, Badge } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';
import { PrivacyPolicyInterface } from 'types/PrivacyPolicy';

interface PropsInterface {
  privacyPolicy: PrivacyPolicyInterface
  privacyPolicyList: PrivacyPolicyInterface[]
  onChange: Function
};

const SetupMenu = (privacyPolicyList: PrivacyPolicyInterface[], onSelect: Function) => {
  
  const { t } = useTranslation();
  
  const handleMenuSelected = (e) => {
    if (onSelect) onSelect(e);
  }
  
  return (
    <Menu>
      {privacyPolicyList.map((privacyPolicy => {
        return (
          <Menu.Item onClick={handleMenuSelected} key={privacyPolicy.version}>
            {t(translations.privacy_page.version)}: {privacyPolicy.version}
          </Menu.Item>
        )
      }))}
    </Menu>
  )
}

export const PrivacyPolicyDropdown = React.memo(({ privacyPolicy, privacyPolicyList, onChange }: PropsInterface) => {
  
  const handleChange = (e) => {
    if (onChange) onChange(e.key)
  }

  const menu = SetupMenu(privacyPolicyList, handleChange);
  
  return (
    <>
      {
        privacyPolicyList.length > 1 ?
          <Dropdown overlay={menu}>
            <Badge size="default" status="error" dot>
              <Version>({privacyPolicy.version})</Version>
            </Badge>
          </Dropdown> :
          <Version>({privacyPolicy.version})</Version>
      }
      
    </>
  )
});

const Version = styled.span`
  font-size: 16px;
  color: #999999;
`;