import React from 'react';
import { AiFillLock } from 'react-icons/ai';
import { GiEarthAmerica } from 'react-icons/gi';
import { MdOutlineAddModerator } from 'react-icons/md';
import { GroupVisibility } from 'utils/constants';
import { uppercaseFirstCharacter } from 'utils/helpers';

export const VisibilityOfGroup = ({ visibility }) => {
    switch (visibility) {
        case GroupVisibility.private:
            return <><AiFillLock /> {uppercaseFirstCharacter(visibility)}</>
        case GroupVisibility.public:
            return <><GiEarthAmerica /> {uppercaseFirstCharacter(visibility)}</>
        default:
            return <><MdOutlineAddModerator /> {uppercaseFirstCharacter(visibility)}</>
    }
}