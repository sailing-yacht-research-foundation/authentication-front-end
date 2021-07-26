import React from 'react';
import styled from 'styled-components';
import { Form, Input, InputNumber, DatePicker, Row, Col } from 'antd';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { media } from 'styles/media';
import { AiFillCloseCircle } from 'react-icons/ai';
import { StyleConstants } from 'styles/StyleConstants';
import { isMobile } from 'utils/helpers';

export const FilterPane = (props) => {

    return (
        <Wrapper {...props}>
            <FilterHeader>
                <FilterTabTitle>Advaced Search</FilterTabTitle>
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

            <Form
                layout={'vertical'}
                name="basic"
                initialValues={{
                    name: '',
                    participants: 6
                }}>
                <Form.Item
                    label="Race Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label="From Date"
                            name="from_date"
                            rules={[{ type: 'date' }]}
                        >
                            <DatePicker
                                ref="datePickerRef"
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

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label="To date"
                            name="to_date"
                            rules={[{ type: 'date' }]}
                        >
                            <DatePicker
                                ref="datePickerRef"
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

                <Form.Item
                    label="Location"
                    name="location"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Number of Participants"
                    name="participants"
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <SyrfFormButton type="primary" htmlType="submit">
                        Search
                    </SyrfFormButton>
                </Form.Item>
            </Form>
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
    z-index: 10;

    ${media.medium`
        position: static;
        padding: 0;
        padding-left: 60px;
        padding-right: 100px;
        border-left: 1px solid #eee;
        border-top: none;
        width: 35%;
        height: 100vh;
        border-radius: 0;
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