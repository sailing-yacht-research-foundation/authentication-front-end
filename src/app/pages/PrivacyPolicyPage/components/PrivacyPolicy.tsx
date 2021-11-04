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
import { PrivacyPolicyDropdown } from './privacyPolicyDropdown';

export const PrivacyPolicy = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [privacyPolicy, setPrivacyPolicy] = React.useState<PrivacyPolicyInterface>(privacypolicyVersionsFilter('', versionList)[0])
  const [privacyPolicyList, setPrivacyPolicyList] = React.useState<PrivacyPolicyInterface[]>(privacypolicyVersionsFilter('', versionList));

  const provicyPolicyActions = usePrivacyPolicySlice().actions;

  const user = useSelector(selectUser);

  React.useEffect(() => {
    handleSelectPrivacyPolicy(user);
  }, [user]);

  const handleSelectPrivacyPolicy = (user) => {
    if (!user) return;
    const privacyPolicies = privacypolicyVersionsFilter(user?.acceptPrivacyPolicyVersion, versionList);
    
    setPrivacyPolicyList(privacyPolicies);
    setPrivacyPolicy(privacyPolicies[0]);
  }

  const handleSelectVersion = (version) => {
    const filteredPrivacyPolicy = privacyPolicyList.filter((privacyPolicy) => privacyPolicy.version === version);
    setPrivacyPolicy(filteredPrivacyPolicy[0]);
  }

  const handleAgree = (privacyPolicy: PrivacyPolicyInterface) => {
    dispatch(provicyPolicyActions.signPolicyVersion(privacyPolicy.version));
  }

  const PrivacyPolicyContent = privacyPolicy.Component;
  const showAgreeButton = user?.id && user?.acceptPrivacyPolicyVersion !== privacyPolicy.version;

  return (
    <div style={{ minHeight: '100vh', marginTop: '100px', padding: '24px' }}>
      <h1 style={{ marginBottom: '0px' }}>
        Privacy Policy for SYRF&nbsp;
        <PrivacyPolicyDropdown privacyPolicyList={privacyPolicyList} privacyPolicy={privacyPolicy} onChange={handleSelectVersion} />
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