import React from 'react';
import { Form, Menu, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { StyledPLaceDropdown } from 'app/components/SyrfGeneral';
import PlacesAutocomplete from 'react-places-autocomplete';

export const FormItemEndLocationAddress = ({ form, address, endAddress, handleEndAddressChange, handleSelectEndAddress }) => {

    const { t } = useTranslation();

    React.useEffect(() => {
        if (!endAddress) {
            form.setFieldsValue({
                endLat: null,
                endLon: null
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endAddress]);

    return (
        <Tooltip title={t(translations.tip.event_location_end)}>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_location)}</SyrfFieldLabel>}
                name="endLocation"
            >
                <PlacesAutocomplete
                    value={address}
                    onChange={handleEndAddressChange}
                    onSelect={handleSelectEndAddress}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <>
                                <SyrfInputField
                                    allowClear
                                    {...getInputProps({
                                        placeholder: t(translations.profile_page.update_profile.search_places),
                                        className: 'location-search-input',
                                    })}
                                    value={endAddress || ''}
                                    autoCorrect="off"
                                />
                                {suggestions.length > 0 && <StyledPLaceDropdown>
                                    {suggestions.map((suggestion) => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                            <Menu.Item
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style,
                                                })}
                                                key={suggestion.index}
                                            >
                                                <span>{suggestion.description}</span>
                                            </Menu.Item>
                                        );
                                    })}
                                </StyledPLaceDropdown>}
                            </>
                        )
                    }}
                </PlacesAutocomplete>
            </Form.Item>
        </Tooltip>
    );
}
