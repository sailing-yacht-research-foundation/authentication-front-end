import './styles/ant-time-range.css';

import { FieldTimeOutlined, FilterFilled, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select, Space } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React from 'react';
import { BiSearch } from 'react-icons/bi';
import styled from 'styled-components';
import { IconWrapper, InputWithNoBrowserSupportAttributes } from '../SyrfGeneral';

export const getColumnSearchProps = (dataIndex: any, handleSearch: Function, handleReset: Function): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <InputWithNoBrowserSupportAttributes
                placeholder={`Search...`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space size={5}>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    icon={<IconWrapper><BiSearch /></IconWrapper>}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
});

export const getColumnTimeProps = (dataIndex, handleSearch: Function, handleReset: Function) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <TimeRangePickerWrapper style={{ padding: 8, textAlign: 'right' }}>
            <DatePicker.RangePicker
                onChange={e => {
                    setSelectedKeys(e?.length ? [e] : [])
                }}
                style={{ width: 400 }}
                placeholder={["Start", "End"]}
                value={selectedKeys[0]}
                format="YYYY-MM-DD HH:mm:ss"
            />
            <br />
            <Space size={5} style={{ marginTop: '5px' }}>
                <Button
                    type="primary"
                    role="search"
                    onClick={() => {
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }}
                    style={{ width: 90 }}
                    icon={<IconWrapper><BiSearch /></IconWrapper>}
                    size="small"
                >
                    Search
                </Button>
                <Button
                    role="reset"
                    style={{ width: 90 }}
                    onClick={() => handleReset(clearFilters, dataIndex)}
                    size="small"
                >
                    Reset
                </Button>
            </Space>
        </TimeRangePickerWrapper>
    ),
    filterIcon: filtered => (
        <FieldTimeOutlined type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    )
});

export const getColumnCheckboxProps = (dataIndex, filterCriteria, handleSearch: Function, handleReset: Function) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, textAlign: 'right' }}>
            <Select value={selectedKeys[0]} style={{ width: '100%' }} mode='multiple' maxTagCount={'responsive'} onChange={value => setSelectedKeys([value])}>
                {filterCriteria.map((criteria, index) => <Select.Option key={index} value={criteria}>{criteria}</Select.Option>)}
            </Select>
            <br />
            <Space size={5} style={{ marginTop: '5px', zIndex: 1 }}>
                <Button
                    type="primary"
                    role="search"
                    onClick={() => {
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }}
                    style={{ width: 90 }}
                    icon={<IconWrapper><BiSearch /></IconWrapper>}
                    size="small"
                >
                    Search
                </Button>
                <Button
                    role="reset"
                    style={{ width: 90 }}
                    onClick={() => handleReset(clearFilters, dataIndex)}
                    size="small"
                >
                    Reset
                </Button>
            </Space>
        </div>
    ),
    filterIcon: filtered => (
        <FilterFilled style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
});

const TimeRangePickerWrapper = styled.div`
    padding: 8
    text-align: right;
`;
