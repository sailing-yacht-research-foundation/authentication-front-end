import React from 'react';
import { useHistory, useParams } from 'react-router';
import { getGroupById } from 'services/live-data-server/groups';
import styled from 'styled-components';
import { LeftPane } from './LeftPane';
import { Nav } from './Nav';
import { Members } from './Members';
import { Spin } from 'antd';
import { media } from 'styles/media';

export const Main = () => {
    const [group, setGroup] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { groupId } = useParams<{ groupId: string }>();

    const history = useHistory();

    const getGroupDetail = async () => {
        setIsLoading(true);
        const response = await getGroupById(groupId);
        setIsLoading(false);

        if (response.success) {
            setGroup(response.data);
        } else {
            history.goBack();
        }
    }

    React.useEffect(() => {
        getGroupDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <Spin spinning={isLoading}>
                <Nav group={group} />
                <Container>
                    <LeftPane group={group} />
                    <Members group={group} />
                </Container>
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;

    ${media.medium`
        padding: 30px 15px 0 15px;
        max-width: 80%;
    `}
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;

    ${media.medium`
        flex-direction: row;
    `}
`;