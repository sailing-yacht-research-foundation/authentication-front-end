import React from 'react';
import { Form, Menu } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { StyledPLaceDropdown } from 'app/components/SyrfGeneral';
import PlacesAutocomplete from 'react-places-autocomplete';

export const FormItemEndLocationAddress = ({ address, endAddress, handleEndAddressChange, handleSelectEndAddress }) => {

    const { t } = useTranslation();

    return (
        <>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_location)}</SyrfFieldLabel>}
                name="endLocation"
                className="event-location-step"
                data-tip={t(translations.tip.event_location_end)}
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
                                    {...getInputProps({
                                        placeholder: t(translations.profile_page.update_profile.search_places),
                                        className: 'location-search-input',
                                    })}
                                    allowClear
                                    value={endAddress}
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
        </>
    );
}