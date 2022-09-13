import * as React from 'react';
import { DeleteEventModal } from '../DeleteEventModal';
import * as DeleteEventModalModule from '../DeleteEventModal';
import { createRenderer } from 'react-test-renderer/shallow';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act, fireEvent, render, } from '@testing-library/react';
import * as EventServiceModule from 'services/live-data-server/event-calendars';
import * as Helper from 'utils/helpers';

const shallowRenderer = createRenderer();

const modalShowComponent = (
    <DeleteEventModal event={{}}
        onRaceDeleted={jest.fn}
        showDeleteModal={false}
        setShowDeleteModal={jest.fn} />
);

describe('DeleteEventModal', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(modalShowComponent);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    // Use 'it' to test a single attribute of a target
    it('Hide if show modal flag is false', () => {

        shallowRenderer.render(modalShowComponent);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).not.toBeTruthy();
    });

    it('Show if show modal flag is true', async () => {
        shallowRenderer.render(
            <DeleteEventModal event={{}}
                onRaceDeleted={jest.fn}
                showDeleteModal={true}
                setShowDeleteModal={jest.fn} />);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).toBeTruthy();
    });

    it('Modal title and content should match i18next translation language', async () => {
        const t = await i18n;

        shallowRenderer.render(
            <DeleteEventModal event={{}}
                onRaceDeleted={jest.fn}
                showDeleteModal={true}
                setShowDeleteModal={jest.fn} />);

        expect(t(shallowRenderer.getRenderOutput().props.title)).toBe(t(translations.delete_event_modal.are_you_sure_you_want_to_delete));
        expect(t(shallowRenderer.getRenderOutput().props.children.props.children)).toBe(t(translations.delete_event_modal.you_will_delete));
    });

    it("It should have been rendered with correct received props", () => {
        const deleteEventModalSpy = jest.spyOn(DeleteEventModalModule, 'DeleteEventModal');

        render(<DeleteEventModal event={{}}
            onRaceDeleted={jest.fn}
            showDeleteModal={true}
            setShowDeleteModal={jest.fn} />);

        expect(deleteEventModalSpy).toHaveBeenCalledWith({
            event: {},
            onRaceDeleted: jest.fn,
            showDeleteModal: true,
            setShowDeleteModal: jest.fn
        }, {});
    });

    it("It should call setShowDeleteModal when pressing cancel text", () => {
        const setShowDeleteModalMock = jest.fn();

        const { getByText } = render(
            <DeleteEventModal event={{}}
                onRaceDeleted={jest.fn}
                showDeleteModal={true}
                setShowDeleteModal={setShowDeleteModalMock} />
        );

        act(() => {
            fireEvent.click(getByText('Cancel'));
        });

        expect(setShowDeleteModalMock).toHaveBeenCalledWith(false);
    });

    it('should call deleteEvent when pressing OK text', async () => {
        const deleteEventSpy = jest.spyOn(EventServiceModule, 'deleteEvent').mockImplementation(() => {
            return Promise.resolve({ success: true })
        });
        const onRaceDeletedMock = jest.fn();

        const { getByText } = render(
            <DeleteEventModal event={{}}
                onRaceDeleted={onRaceDeletedMock}
                showDeleteModal={true}
                setShowDeleteModal={jest.fn} />
        );

        act(() => {
            fireEvent.click(getByText('OK'));
        });

        expect(deleteEventSpy).toHaveBeenCalled();
        await act(() => Promise.resolve());
        expect(onRaceDeletedMock).toHaveBeenCalled();
    });

    it('should call deleteEvent and show error when pressing OK text with failed response', async () => {
        const deleteEventSpy = jest.spyOn(EventServiceModule, 'deleteEvent').mockImplementation(() => {
            return Promise.resolve({ success: false })
        });
        const showToastSpy = jest.spyOn(Helper, 'showToastMessageOnRequestError');

        const { getByText } = render(
            <DeleteEventModal event={{}}
                onRaceDeleted={jest.fn}
                showDeleteModal={true}
                setShowDeleteModal={jest.fn} />
        );

        act(() => {
            fireEvent.click(getByText('OK'));
        });

        expect(deleteEventSpy).toHaveBeenCalled();
        await act(() => Promise.resolve());
        expect(showToastSpy).toHaveBeenCalled();
    });
});
