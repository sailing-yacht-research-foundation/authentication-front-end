import React from 'react';
import { Tabs } from 'antd';
import { MapViewTab } from './MapViewTab/index';

export const CourseCreate = () => {
    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="tab 1" key="1">
                <MapViewTab/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="tab 2" key="2">
            </Tabs.TabPane>
        </Tabs>
    )
}