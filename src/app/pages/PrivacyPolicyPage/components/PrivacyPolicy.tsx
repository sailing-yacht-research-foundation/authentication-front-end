import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { PrivacyPolicyInterface } from 'types/PrivacyPolicy';
import { privacypolicyVersionsFilter } from 'utils/privacy-policy';

import { usePrivacyPolicySlice } from '../slice';
import { versionList } from './privacyPolicyVersions';

export const PrivacyPolicy = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const privacyPolicy = React.useRef<PrivacyPolicyInterface>(privacypolicyVersionsFilter('', versionList)[0]).current;

  const provicyPolicyActions = usePrivacyPolicySlice().actions;

  const user = useSelector(selectUser);

  const handleAgree = (privacyPolicy: PrivacyPolicyInterface) => {
    dispatch(provicyPolicyActions.signPolicyVersion(privacyPolicy.version));
  }

  const PrivacyPolicyContent = privacyPolicy.Component;
  const showAgreeButton = user?.id && user?.acceptPrivacyPolicyVersion !== privacyPolicy.version;

  return (
    <div style={{ minHeight: '100vh', marginTop: '100px', padding: '24px' }}>
      <h1 style={{ marginBottom: '0px' }}>
        Privacy Policy for SYRF&nbsp;
        <Version>{privacyPolicy.version}</Version>
      </h1>
      <ReleaseDate>Release Date: {moment(privacyPolicy.releaseDate).format('LL')}</ReleaseDate>

      <PrivacyPolicyContent />

      { showAgreeButton && 
          <ButtonParentContainer>
            <ButtonContainer>
              <Button onClick={() => handleAgree(privacyPolicy)} block size="large" type="primary">
                {t(translations.privacy_page.agree)}
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

const Version = styled.span`
  font-size: 16px;
  color: #999999;
`;