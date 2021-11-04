/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { Menu, Dropdown, Badge } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';
import { EulaInterface } from 'types/Eula';

interface PropsInterface {
  eula: EulaInterface
  eulaList: EulaInterface[]
  onChange: Function
};

const SetupMenu = (eulaList: EulaInterface[], onSelect: Function) => {
  const { t } = useTranslation();
  
  const handleMenuSelected = (e) => {
    if (onSelect) onSelect(e);
  }
  
  return (
    <Menu>
      {eulaList.map((eula => {
        return (
          <Menu.Item onClick={handleMenuSelected} key={eula.version}>
            {t(translations.eulapage.version)}: {eula.version}
          </Menu.Item>
        )
      }))}
    </Menu>
  )
}

export const EulaDropdown = React.memo(({ eula, eulaList, onChange }: PropsInterface) => {
  
  const handleChange = (e) => {
    if (onChange) onChange(e.key)
  }

  const menu = SetupMenu(eulaList, handleChange);
  
  return (
    <>
      {
        eulaList.length > 1 ?
          <Dropdown overlay={menu}>
            <Badge size="default" status="error" dot>
              <Version>({eula.version})</Version>
            </Badge>
          </Dropdown> :
          <Version>({eula.version})</Version>
      }
      
    </>
  )
});

const Version = styled.span`
  font-size: 16px;
  color: #999999;
`;