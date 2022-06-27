import { FieldTimeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Space } from 'antd';
import { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';

export const getColumnSearchProps = (dataIndex: any, searchInput, handleSearch: Function, handleReset: Function): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
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
    onFilter: (value, record) => true,
    onFilterDropdownVisibleChange: visible => {
        if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
        }
    },
    render: text => text
});

export const getColumnTimeProps = (dataIndex, handleSearch, handleReset) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, textAlign: 'right' }}>
            <DatePicker.RangePicker
                onChange={e => {
                    setSelectedKeys(e?.length ? [e] : [])
                }}
                placeholder={["Start", "End"]}
                value={selectedKeys[0]}
                format="YYYY-MM-DD HH:mm:ss"
            />
            <br/>
            <Space size={5} style={{marginTop: '5px'}}>
                <Button
                    type="primary"
                    role="search"
                    onClick={() => {
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }}
                    style={{ width: 90, marginRight: 8 }}
                    icon={<SearchOutlined />}
                    size="small"
                >
                    Search
                </Button>
                <Button
                    role="reset"
                    style={{ width: 90 }}
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                >
                    Reset
                </Button>
            </Space>
        </div>
    ),
    filterIcon: filtered => (
        <FieldTimeOutlined type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex] ? moment(record[dataIndex]).isBetween(moment(value[0]), moment(value[1])) : "",
    render: text => text
});
