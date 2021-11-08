import React from 'react';
import { Modal, Checkbox, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';
import * as eulaVersion from 'app/pages/EULAPage/components/eulaVersions';
import * as privacyPolicyVersion from 'app/pages/PrivacyPolicyPage/components/privacyPolicyVersions';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { EulaInterface } from 'types/Eula';
import { eulaVersionsFilter } from 'utils/eula';
import { PrivacyPolicyInterface } from 'types/PrivacyPolicy';
import { privacypolicyVersionsFilter } from 'utils/privacy-policy';
import { translations } from 'locales/translations';
import { updateAgreements } from 'services/live-data-server/user';

export const AgreementModal = React.memo(() => {
  
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loginActions = UseLoginSlice().actions;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [isModalOpen,setIsModalOpen] = React.useState<boolean>(false);
  const [isAgree, setIsAgree] = React.useState({ eula: false, privacy: false });
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false);

  const eula = React.useRef<EulaInterface>(eulaVersionsFilter(eulaVersion.versionList)[0]).current;
  const privacyPolicy = React.useRef<PrivacyPolicyInterface>(privacypolicyVersionsFilter(privacyPolicyVersion.versionList)[0]).current;

  React.useEffect(() => {
    if (!isAuthenticated) setIsModalOpen(false);
    else handleCheckIsAcceptAgreement(location, user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, location, user]);

  React.useEffect(() => {
    if (!isModalOpen) handleResetBodyOverflow();
  }, [isModalOpen])

  const handleCheckIsAcceptAgreement = (location, user) => {
    if (!user?.id) {
      setIsModalOpen(false);
      return;
    }

    const { pathname } = location;
    if (pathname.includes('/eula') || pathname.includes('/privacy-policy')) {
      setIsModalOpen(false);
      return;
    }

    const agreedWith = {
      eula: user.acceptEulaVersion === eula.version,
      privacy: user.acceptPrivacyPolicyVersion === privacyPolicy.version
    };

    if (!agreedWith.eula || !agreedWith.privacy) {
      setIsAgree(agreedWith);
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(false);
  }

  const handleCheckboxChange = (e) => {
    setIsAgree({
      ...isAgree,
      [e.target.value]: e.target.checked
    });
  }

  const handleButtonClick = async () => {
    setIsButtonLoading(true);

    const composedData = {
      eulaVersion: eula.version,
      privacyPolicyVersion: privacyPolicy.version, 
    };

    const response = await updateAgreements(composedData);
    setIsButtonLoading(false);

    if (response.success) {
      setIsModalOpen(false);
      dispatch(loginActions.getUser());
      return;
    }

    message.error(response?.error?.message || 'Failed to agreed with the data')
  }

  const handleResetBodyOverflow = () => {
    setTimeout(() => {
      const { style } = document.body;
      if (style.overflow === 'hidden') style.overflow = ''; 
    }, 300)
  }
  
  return (
    <>
      <Modal width={350} title={t(translations.agreement_modal.title)} closable={false} footer={null} visible={isModalOpen}>
        <Description>{t(translations.agreement_modal.description)}</Description>
        
        <CheckboxContainer>
          <Checkbox onChange={handleCheckboxChange} checked={isAgree.eula} value="eula">{t(translations.signup_page.agree_to)} <Link to="eula">{t(translations.signup_page.eula)}</Link></Checkbox>
        </CheckboxContainer>
        
        <CheckboxContainer>
          <Checkbox onChange={handleCheckboxChange} checked={isAgree.privacy} value="privacy">{t(translations.signup_page.agree_to)}  <Link to="privacy-policy">{t(translations.signup_page.privacy_policy)}</Link></Checkbox>
        </CheckboxContainer>

        <ButtonAgree onClick={handleButtonClick} disabled={!isAgree.eula || !isAgree.privacy} loading={isButtonLoading} block>
          {t(translations.agreement_modal.agree)}
        </ButtonAgree>
      </Modal>
    </>
  )
});

const CheckboxContainer = styled.div`
  margin-bottom: 8px;
`;

const Description = styled.p`
`;

const ButtonAgree = styled(Button)`
  margin-top: 8px;
`;