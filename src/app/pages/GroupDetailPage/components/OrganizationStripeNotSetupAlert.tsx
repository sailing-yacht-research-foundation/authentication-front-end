import React from 'react';
import { Alert } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const OrganizationStripeNotSetupAlert = () => {
    return (
        <Wrapper>
            <Alert
                message="It appears that your organization is not linked to our Stripe account. Click see more to check it out."
                type="warning"
                closable
                action={
                    <Link to={'/'}>
                      Setup Stripe
                    </Link>
                  }
            />
        </Wrapper>);
}

const Wrapper = styled.div`
    margin: 10px 0;
    margin-top: 15px;
`;