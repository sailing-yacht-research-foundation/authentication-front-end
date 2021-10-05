import React from 'react';
import styled from 'styled-components';
import { Form, Input, DatePicker, Row, Col, Spin } from 'antd';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { media } from 'styles/media';
import { AiFillCloseCircle } from 'react-icons/ai';
import { StyleConstants } from 'styles/StyleConstants';
import { isMobile } from 'utils/helpers';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { useHomeSlice } from '../slice';
import moment from 'moment';
import { selectIsSearching, selectFromDate, selectSearchKeyword, selectToDate } from '../slice/selectors';
import { TIME_FORMAT } from 'utils/constants';
import { useHistory } from 'react-router-dom';

export const FilterPane = (props) => {

    const { defaultFocus } = props;

    const searchKeyword = useSelector(selectSearchKeyword);

    const searchInputRef = React.createRef<Input>();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useHomeSlice();

    const isSearching = useSelector(selectIsSearching);

    const history = useHistory();

    const [form] = Form.useForm();

    const fromDate = useSelector(selectFromDate);

    const toDate = useSelector(selectToDate);

    useEffect(() => {
        if (defaultFocus && searchInputRef) {
            searchInputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFormSubmit = (values) => {
        dispatch(actions.setResults([]));

        const { name, from_date, to_date } = values;
        const params: any = {};

        params.keyword = name;
        if (from_date) params.from_date = moment(from_date).format(TIME_FORMAT.number);
        if (to_date) params.to_date = moment(to_date).format(TIME_FORMAT.number);

        dispatch(actions.setPage(1));
        dispatch(actions.setKeyword(params.keyword ?? ''));
        dispatch(actions.setFromDate(params.from_date ?? ''));
        dispatch(actions.setToDate(params.to_date ?? ''));
        dispatch(actions.searchRaces(params));

        history.push({
            pathname: '/',
            search: Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
        });
    }

    React.useEffect(() => {
        form.setFieldsValue({ // reset the email to the last state.
            name: searchKeyword,
            from_date: fromDate && moment(fromDate).isValid() ? moment(fromDate) : '',
            to_date: toDate && moment(toDate).isValid() ? moment(toDate) : ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKeyword, fromDate, toDate]);

    return (
        <Wrapper {...props}>
            <FilterHeader>
                <FilterTabTitle>{t(translations.home_page.filter_tab.advanced_search)}</FilterTabTitle>
                {props.closable && !isMobile() && <AiFillCloseCircle
                    onClick={props.close}
                    style={{ cursor: 'pointer' }}
                    size={22}
                    color={StyleConstants.MAIN_TONE_COLOR} />}
                <StyledAiFillCloseCircle
                    onClick={props.close}
                    style={{ cursor: 'pointer' }}
                    size={22}
                    color={StyleConstants.MAIN_TONE_COLOR} />
            </FilterHeader>

            <Spin spinning={isSearching}>
                <Form
                    form={form}
                    layout={'vertical'}
                    name="basic"
                    onFinish={onFormSubmit}
                    initialValues={{
                        name: searchKeyword,
                    }}>
                    <Form.Item
                        label={t(translations.home_page.filter_tab.race_name)}
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input ref={searchInputRef}
                            value={searchKeyword}
                        />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <Form.Item
                                label={t(translations.home_page.filter_tab.from_date)}
                                name="from_date"
                                rules={[{ type: 'date' }]}
                            >
                                <DatePicker
                                    showToday={false}
                                    style={{ width: '100%' }}
                                    dateRender={current => {
                                        return (
                                            <div className="ant-picker-cell-inner">
                                                {current.date()}
                                            </div>
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12}>
                            <Form.Item
                                label={t(translations.home_page.filter_tab.to_date)}
                                name="to_date"
                                rules={[{ type: 'date' }]}
                            >
                                <DatePicker
                                    showToday={false}
                                    style={{ width: '100%' }}
                                    dateRender={current => {
                                        return (
                                            <div className="ant-picker-cell-inner">
                                                {current.date()}
                                            </div>
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.home_page.filter_tab.search)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    width: 100%;
    border-radius: 8px;
    padding: 0 20px;
    border-top: 1px solid #eee;
    z-index: 100;

    ${media.medium`
        position: static;
        padding: 0;
        padding-left: 60px;
        padding-right: 100px;
        border-left: 1px solid #eee;
        border-top: none;
        width: 35%;
        border-radius: 0;
        padding-top: 50px;
    `}
`;

const FilterTabTitle = styled.h4`
    padding: 10px 0;
    margin-bottom: 20px;
`;

const FilterHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledAiFillCloseCircle = styled(AiFillCloseCircle)`
    display: block;

    ${media.medium`
        display: none;
    `}
`;