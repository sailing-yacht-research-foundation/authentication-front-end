import React from 'react';
import { useHistory, useParams } from 'react-router';
import { getGroupById } from 'services/live-data-server/groups';
import styled from 'styled-components';
import { LeftPane } from './LeftPane';
import { Nav } from './Nav';
import { RightPane } from './RightPane';

export const Main = () => {
    const [group, setGroup] = React.useState<any>({});
    
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { groupId } = useParams<{ groupId: string }>();

    const history = useHistory();

    const getGroupDetail = () => {
        setIsLoading(true);
        const response = getGroupById(groupId);
        setIsLoading(false);

        if (response.success) {
            console.log(response.data);
            setGroup(response.data);
        } else {
            history.goBack();
        }
    }

    React.useEffect(() => {
        getGroupDetail();
    }, []);
    
    return (
        <Wrapper>
            <Nav />
            <Container>
                <LeftPane />
                <RightPane />
            </Container>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 30px 15px 0 15px;
    max-width: 80%;
    margin: 0 auto;
`;

const Container = styled.div`
    display: flex;
`;

export const UserItem = styled.div`
    display: flex;
    align-items: center;
    &:not(:last-child) {
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
`;

export const UserAvatarContainer = styled.div`
    width: 35px;
    height: 35px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin-right: 15px;
`;

export const UserInforContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const UserName = styled.a`
    font-weight: bold;
`;

export const UserDescription = styled.span`
    color: hsl(210, 8%, 45%);
    font-size: 13px;
`;