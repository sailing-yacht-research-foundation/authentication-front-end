import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { media } from 'styles/media';

export const PageHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 30px 15px;
`;

export const PageHeaderText = styled.h2`
`;

export const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;