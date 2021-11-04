import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { EulaInterface } from 'types/Eula';
import { eulaVersionsFilter } from 'utils/eula';

import { useEulaSlice } from '../slice';
import { versionList } from './eulaVersions';
import { EulaDropdown } from './eulaDropdown';

export const EULA = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [eula, setEula] = React.useState<EulaInterface>(eulaVersionsFilter('', versionList)[0])
  const [eulaList, setEulaList] = React.useState<EulaInterface[]>(eulaVersionsFilter('', versionList));

  const eulaActions = useEulaSlice().actions;

  const user = useSelector(selectUser);

  React.useEffect(() => {
    handleSelectEula(user);
  }, [user])

  const handleSelectEula = (user) => {
    if (!user) return;
    const eulas = eulaVersionsFilter(user?.acceptEulaVersion, versionList);
    
    setEulaList(eulas);
    setEula(eulas[0]);
  }

  const handleSelectVersion = (version) => {
    const filteredEula = eulaList.filter((eula) => eula.version === version);
    setEula(filteredEula[0]);
  }

  const handleAgree = (eula: EulaInterface) => {
    dispatch(eulaActions.signEulaVersion(eula.version));
  }
  
  const EulaContent = eula.Component;
  const showAgreeButton = user?.id && user?.acceptEulaVersion !== eula.version;

  return (
    <div style={{ minHeight: '100vh', marginTop: '100px', padding: '24px' }}>
      <h1 style={{ marginBottom: '0px' }}>
        End-User License Agreement (EULA) of <span className="app_name"><span className="highlight preview_app_name">LivePing and SYRF Webapps</span></span>&nbsp;
        <EulaDropdown eulaList={eulaList} eula={eula} onChange={handleSelectVersion} />
      </h1>
      <ReleaseDate>Release Date: {moment(eula.releaseDate).format('LL')}</ReleaseDate>
      
      <EulaContent />

      { showAgreeButton && 
          <ButtonParentContainer>
            <ButtonContainer>
              <Button onClick={() => handleAgree(eula)} block size="large" type="primary">
                {t(translations.eulapage.agree)}
              </Button>
            </ButtonContainer>
          </ButtonParentContainer>
      }
    </div>
  )
}

const ReleaseDate = styled.p`
  color: #999999;
  font-size: 16px;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  max-width: 350px;
  margin: auto;
`;

const ButtonParentContainer = styled.div`
  margin-top: 24px;
`;