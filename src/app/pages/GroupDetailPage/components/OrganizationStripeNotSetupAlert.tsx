import React from 'react';
import { Alert } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Group } from 'types/Group';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { GroupTypes } from 'utils/constants';

export const OrganizationStripeNotSetupAlert = ({ group }: { group: Partial<Group> }) => {

    const { t } = useTranslation();

    if (!group.stripePayoutsEnabled && group.isAdmin && group.groupType === GroupTypes.ORGANIZATION)
        return (
            <Wrapper>
                <Alert
                    message={t(translations.group.it_appears_that_your_organization_has_not_connected_to_payout_click_here_to_set_it_up)}
                    type="warning"
                    closable
                    action={
                        <Link to={`/groups/${group.id}/organization-connect`}>
                            {t(translations.group.set_up)}
                        </Link>
                    }
                />
            </Wrapper>
        );

    return (<></>);
}

const Wrapper = styled.div`
    margin: 10px 0;
    margin-top: 15px;
`;