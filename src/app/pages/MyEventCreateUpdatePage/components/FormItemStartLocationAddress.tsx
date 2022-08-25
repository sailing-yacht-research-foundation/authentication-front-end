import React from 'react';
import { Form, Menu, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { StyledPLaceDropdown } from 'app/components/SyrfGeneral';
import PlacesAutocomplete from 'react-places-autocomplete';

export const FormItemStartLocationAddress = ({ handleAddressChange, handleSelectAddress, address }) => {

    const { t } = useTranslation();

    return (
        <Tooltip title={t(translations.tip.event_location_start)}>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_location)}</SyrfFieldLabel>}
                name="location"
                rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
            >
                <PlacesAutocomplete
                    value={address}
                    onChange={handleAddressChange}
                    onSelect={handleSelectAddress}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <>
                                <SyrfInputField
                                    {...getInputProps({
                                        placeholder: t(translations.profile_page.search_places),
                                        className: 'location-search-input',
                                    })}
                                    value={address}
                                    allowClear
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
    )
}
