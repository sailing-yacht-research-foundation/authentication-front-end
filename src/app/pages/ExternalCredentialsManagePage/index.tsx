import * as React from 'react';
import { Row } from 'antd';
import { CredentialList } from './components/CredentialList';
import { Wrapper } from 'app/components/SyrfGeneral';

export const ExternalCredentialsManagePage = (props) => {

    return (
        <Wrapper>
            <CredentialList />
        </Wrapper>
    );
}
