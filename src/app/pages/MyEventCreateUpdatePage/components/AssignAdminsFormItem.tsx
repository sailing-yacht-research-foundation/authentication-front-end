import React from 'react';
import { Form, Select, Switch, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { renderAvatar, getUserAttribute } from 'utils/user-utils';
import { debounce } from 'utils/helpers';
import { searchGroupForAssigns } from 'services/live-data-server/groups';
import { searchForProfiles } from 'services/live-data-server/profile';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useSelector } from 'react-redux';
import { AdminType } from 'utils/constants';
import { ItemAvatar } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router-dom';

export const AssignAdminsFormItem = (props) => {

    const user = useSelector(selectUser);

    const { event } = props;

    const history = useHistory();

    // eslint-disable-next-line
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const { t } = useTranslation();

    const [items, setItems] = React.useState<any[]>([]);

    const handleSwitchChange = (checked, e, item) => {
        e.stopPropagation();

        setItems(items.map(i => {
            if (i.id === item.id) {
                i.isIndividualAssignment = checked
            }

            return i;
        }))
    }

    const navigateToProfile = (e, item) => {
        e.stopPropagation();
        history.push(`/${item.type === AdminType.GROUP ? 'groups' : 'profile'}/${item.id}`);
    }

    const renderItemResults = () => {
        return items.map(item => <Select.Option style={{ padding: '5px' }} value={JSON.stringify(item)}>
            <ItemAvatar onClick={(e) => navigateToProfile(e, item)} src={renderAvatar(item.avatar)} /> {item.name}
            {item.type === AdminType.GROUP && <Switch checked={item.isIndividualAssignment} style={{ marginLeft: '10px' }} checkedChildren={t(translations.my_event_create_update_page.group_members_assignment)} unCheckedChildren={t(translations.my_event_create_update_page.group_assignment)} onChange={(checked, e) => handleSwitchChange(checked, e, item)} />}
        </Select.Option>)
    }

    const onSearch = async (keyword) => {
        setItems([]);
        const groupResponse = await searchGroupForAssigns(keyword);
        const peopleResponse = await searchForProfiles(keyword, getUserAttribute(user, 'locale'));
        let groupRows = [];
        let peopleRows = [];

        if (groupResponse.success) {
            groupRows = groupResponse.data.rows.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                    isIndividualAssignment: false
                }
            });
        }

        if (peopleResponse.success) {
            peopleRows = peopleResponse.data.map(p => {
                return {
                    type: AdminType.INDIVIDUAL,
                    id: p.id,
                    avatar: p.avatar,
                    name: p.name,
                    isIndividualAssignment: false
                }
            })
        }

        setItems([...groupRows, ...peopleRows]);
    }

    React.useEffect(() => {
        let groupRows = [];
        let peopleRows = [];
        if (event.editors) {
            peopleRows = event.editors.map(editor => ({
                type: AdminType.INDIVIDUAL,
                id: editor.id,
                avatar: editor.avatar,
                name: editor.name,
                isIndividualAssignment: false
            }));
        }

        if (event.groups) {
            groupRows = event.groups.map(group => {
                return {
                    type: AdminType.GROUP,
                    id: group.id,
                    avatar: group.groupImage,
                    name: group.groupName,
                    isIndividualAssignment: false
                }
            });
        }

        setItems([...peopleRows, ...groupRows]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event]);

    return (
        <Tooltip title={t(translations.tip.set_admins_for_this_event)}>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.admins)}</SyrfFieldLabel>}
                name="admins">
                <SyrfFormSelect mode="multiple"
                    style={{ width: '100%' }}
                    placeholder={t(translations.tip.set_admins_for_this_event)}
                    onSearch={debounceSearch}
                    filterOption={false}
                    allowClear
                    maxTagCount={'responsive' as const}
                >
                    {renderItemResults()}
                </SyrfFormSelect>
            </Form.Item>
        </Tooltip>
    )
}