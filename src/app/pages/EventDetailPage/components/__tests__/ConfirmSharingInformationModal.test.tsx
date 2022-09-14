import * as React from 'react';
import * as ConfirmSharingInformationModalModule from '../ConfirmSharingInformationModal';
import { createRenderer } from 'react-test-renderer/shallow';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act, fireEvent, render, } from '@testing-library/react';
import * as ParticipantServiceModule from 'services/live-data-server/participants';
import * as Helpers from 'utils/helpers';

const uuid = require('uuid');
const shallowRenderer = createRenderer();
const eventMock = { id: uuid.v4() }
const modalShowComponent = (
    <ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={true} setShowModal={jest.fn} event={eventMock} requiredInformation={[]} reloadParent={jest.fn} />
);

describe('ConfirmSharingInformationModal', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(<ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={true} setShowModal={jest.fn} event={{}} requiredInformation={[]} reloadParent={jest.fn} />);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Hide if show modal flag is false', () => {

        shallowRenderer.render(<ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={false} setShowModal={jest.fn} event={eventMock} requiredInformation={[]} reloadParent={jest.fn} />);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).toBeFalsy();
    });

    it('Show if show modal flag is true', async () => {
        shallowRenderer.render(modalShowComponent);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).toBeTruthy();
    });

    it('Modal title and content should match i18next translation language', async () => {
        const t = await i18n;

        shallowRenderer.render(modalShowComponent);

        expect(t(shallowRenderer.getRenderOutput().props.title)).toBe(t(translations.event_detail_page.share_information_to_the_organizers));
        expect(shallowRenderer.getRenderOutput().props.children[0].props.children).toBe(t(translations.event_detail_page.by_clicking_the_accept_button_you_will_share_the_following_information_to_the_organizer));
    });

    it("It should call setShowModal when pressing cancel text", () => {
        const setShowModalMock = jest.fn();

        const { getByText } = render(<ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={true} setShowModal={setShowModalMock} event={eventMock} requiredInformation={[]} reloadParent={jest.fn} />);

        act(() => {
            fireEvent.click(getByText('Cancel'));
        });

        expect(setShowModalMock).toHaveBeenCalledWith(false);
    });

    it("It should call shareInformationAfterJoinedEvent when pressing Accept text", async () => {
        const shareInformationAfterJoinedEventSpy = jest.spyOn(ParticipantServiceModule, 'shareInformationAfterJoinedEvent').mockImplementation(() => {
            return Promise.resolve({
                success: true
            })
        });
        const setShowModalMock = jest.fn();
        const reloadParentMock = jest.fn();

        const { getByText } = render(<ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={true} setShowModal={setShowModalMock} event={eventMock} requiredInformation={[]} reloadParent={reloadParentMock} />);

        act(() => {
            fireEvent.click(getByText('Accept'));
        });

        expect(shareInformationAfterJoinedEventSpy).toHaveBeenCalledTimes(1);
        await act(() => Promise.resolve());
        expect(setShowModalMock).toHaveBeenCalled();
        expect(reloadParentMock).toHaveBeenCalled();
    });

    it("It should call shareInformationAfterJoinedEvent when pressing Accept text and showToastOnServerResponseError on response failed", async () => {
        const shareInformationAfterJoinedEventSpy = jest.spyOn(ParticipantServiceModule, 'shareInformationAfterJoinedEvent').mockImplementation(() => {
            return Promise.resolve({
                success: false
            })
        });
        const showToastMessageOnRequestErrorSpy = jest.spyOn(Helpers, 'showToastMessageOnRequestError');
        const setShowModalMock = jest.fn();
        const reloadParentMock = jest.fn();

        const { getByText } = render(<ConfirmSharingInformationModalModule.ConfirmSharingInformationModal showModal={true} setShowModal={setShowModalMock} event={eventMock} requiredInformation={[]} reloadParent={reloadParentMock} />);

        act(() => {
            fireEvent.click(getByText('Accept'));
        });

        expect(shareInformationAfterJoinedEventSpy).toHaveBeenCalled();
        await act(() => Promise.resolve());
        expect(showToastMessageOnRequestErrorSpy).toHaveBeenCalled();
        expect(setShowModalMock).not.toHaveBeenCalled();
        expect(reloadParentMock).not.toHaveBeenCalled();
    });
});
