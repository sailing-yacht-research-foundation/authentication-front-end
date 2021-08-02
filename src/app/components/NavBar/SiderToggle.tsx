import * as React from 'react';
import styled from 'styled-components/macro';
import { MobileMenuWrapper } from './Nav';
import {
    MenuFoldOutlined,
} from '@ant-design/icons';
import { selectIsSiderToggled } from '../SiderContent/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useSiderSlice } from '../SiderContent/slice';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'utils/helpers';

export const SiderToggle = () => {

    const { actions } = useSiderSlice();

    const location = useLocation();

    const dispatch = useDispatch();

    const isSiderToggled = useSelector(selectIsSiderToggled);

    const toggleSider = () => {
        dispatch(actions.setIsToggled(!isSiderToggled));
    }

    React.useEffect(() => {
        if (isMobile()) {
            dispatch(actions.setIsToggled(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (isMobile()) {
            dispatch(actions.setIsToggled(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    return (
        <MobileMenuWrapper>
            <ToggleSiderButton onClick={toggleSider} />
        </MobileMenuWrapper>
    );
}

const ToggleSiderButton = styled(MenuFoldOutlined)`
  font-size: 25px;
  cursor: pointer;
  margin-right: 20px;
`;
