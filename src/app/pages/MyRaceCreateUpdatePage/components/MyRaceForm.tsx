import React from 'react';
import { Spin, Form, Input, DatePicker, Row } from 'antd';
import { PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import { SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';

export const MyRaceForm = () => {

    const onFinish = (values) => {

    }

    return (
        <Wrapper>
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start' }}>
                <PageHeaderText>Create a new race</PageHeaderText>
            </PageHeaderContainer>
            <SyrfFormWrapper>
                <Spin spinning={false} tip={'Creating course...'}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Name"
                            name="email"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label="Location name"
                            name="email"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item
                            label={'Start Date'}
                            name="approximateStartTime"
                            rules={[{ type: 'date', required: true }]}
                        >
                            <DatePicker
                                showToday={true}
                                className="syrf-datepicker"
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

                        <Form.Item
                            label="External URL"
                            name="externalUrl"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item>
                            <SyrfFormButton type="primary" htmlType="submit">
                                Create
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;