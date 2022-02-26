import * as React from 'react';
import { CredentialList } from './components/CredentialList';
import { Wrapper } from 'app/components/SyrfGeneral';

export const ExternalCredentialsManagePage = () => {

    return (
        <Wrapper>
            <CredentialList />
        </Wrapper>
    );
}
