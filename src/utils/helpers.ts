import i18next from 'i18next';
import * as L from 'leaflet';
import { translations } from 'locales/translations';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { CRITERIA_TO_RAW_CRITERIA, formattedSupportedSearchCriteria, RaceSource, RaceStatus, RAW_CRITERIA_TO_CRITERIA, supportedSearchCriteria, TIME_FORMAT } from 'utils/constants';
import { AuthCode } from './constants';

/**
 * Check if is mobile
 * @returns 
 */
export const isMobile = () => {
    let mobile = false;
    //eslint-disable-next-line
    (function (a) { if (/(iPad|iPhone|iPod|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) mobile = true; })(navigator.userAgent || navigator.vendor);
    return mobile;
}

export const screenWidthIsGreaterThan1024 = () => {
    return document.body.clientWidth > 1024;
}

export const stringToColour = (str) => {
    let hash = 0;
    let colour = '#';

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }

    if (/#([a-fA-F\d]{1,2})\1{2}\b/.test(colour)
        || /#[a-fA-F0-9]{2}(0000)/.test(colour)) { // exclude red & gray color shades
        return stringToColour((Math.random()).toString(36).substring(2));
    }

    return colour;
}

export const milisecondsToMinutes = (duration) => {
    // 1- Convert to seconds:
    let seconds = Math.floor(duration / 1000);
    // 2- Extract hours:
    const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return (String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0'));
}

export const debounce = (callback, time) => {
    let interval;
    return (...args) => {
        clearTimeout(interval);
        interval = setTimeout(() => {
            interval = null;
            // eslint-disable-next-line
            callback(...args);
        }, time);
    };
}

export const throttle = (callback, limit) => {
    let waiting = false;
    return (...args) => {
        if (!waiting) {
            callback(...args);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    }
}

/**
 * Remove all null properties to empty string
 * @param object 
 * @return modified object
 */
export const replaceObjectPropertiesFromNullToEmptyString = (object) => {
    for (let key in object) {
        if (object[key] === null)
            object[key] = '';
    }

    return object;
}

/**
 * Convert base64 url to a JS File Object
 * @param dataurl 
 * @param filename 
 * @returns File file image
 */
export const dataURLtoFile = (dataurl, filename) => {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

/**
 * Format phone number to the right format
 * @param phoneNumber
 */
export const removePlusFromPhoneNumber = (phoneNumber) => {
    if (String(phoneNumber).includes('+')) return phoneNumber;

    return '+' + phoneNumber;
}

/**
 * Add a layer to leaflet draw layer
 * @param sourceLayer 
 * @param targetGroup 
 */
export const addNonGroupLayers = (sourceLayer, targetGroup) => {
    if (sourceLayer instanceof L.LayerGroup) {
        sourceLayer.eachLayer(function (layer) {
            addNonGroupLayers(layer, targetGroup);
        });
    } else {
        targetGroup.addLayer(sourceLayer);
    }
}

/**
 * Render not available text if the value is empty
 * @param value
 * @return string
 */
export const renderEmptyValue = (value, replacement: string | undefined = undefined) => {
    if (value) return value;

    if (replacement) return replacement;

    return i18next.t(translations.misc.not_available);
}

export const renderTimezoneInUTCOffset = (timezone) => {
    if (!timezone) return '';

    const offset = moment.tz(timezone).utcOffset() / 60;

    if (offset > 0) return '+' + offset;

    return offset;
}

/**
 * Render number with commas
 */
export const renderNumberWithCommas = (number) => {
    return String(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Check if email is valid
 * @param email 
 * @returns 
 */
export const checkIfEmailIsValid = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Render uppercase text
 */
export const uppercaseFirstCharacter = (text) => {
    if (!text) return '';
    const type = String(text).toLowerCase();
    return type.charAt(0).toUpperCase() + type.slice(1);
}

/**Extract text from html  */
export const extractTextFromHTML = (s) => {
    let span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};

/**
 * Get caret at current position index from contenteditable string.
 * @param element 
 * @returns 
 */
export const getCaretPosition = (element) => {
    let caretOffset = 0;

    if (window.getSelection !== null) {
        let sel = window.getSelection && window.getSelection();
        if (sel && sel.rangeCount > 0) {
            let range = window?.getSelection()?.getRangeAt(0);
            if (range) {
                let preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        }
    }
    return caretOffset;
}

/**
 * Place caret at the end of the search field.
 * @param el
 */
export const placeCaretAtEnd = (el) => {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

/**
 * Replace criteria with pilled criteria
 * @param string 
 * @returns String pilled criteria.
 */
export const replaceCriteriaWithPilledCriteria = (string) => {
    supportedSearchCriteria.forEach(criteria => {
        const convertedRawCriteria = RAW_CRITERIA_TO_CRITERIA[criteria];
        if (convertedRawCriteria)
            string = string.replace(criteria + ':', `<span contenteditable="false" class="pill">${RAW_CRITERIA_TO_CRITERIA[criteria]}:</span>`);
    });

    return string;
}

/**
 * Replace formatted criteria with raw criteria
 * @param string 
 * @returns 
 */
export const replaceFormattedCriteriaWithRawCriteria = (string): string => {
    formattedSupportedSearchCriteria.forEach(criteria => {
        const convertedSupportedCriteria = CRITERIA_TO_RAW_CRITERIA[criteria];
        if (convertedSupportedCriteria)
            string = string.replace(criteria, CRITERIA_TO_RAW_CRITERIA[criteria]);
    });

    return string;
}

/**
 * Remove whole text node (pilled criteria) on backspace.
 * @param event
 */
export const removeWholeTextNodeOnBackSpace = (e) => {
    if (e.key === "Backspace") {
        var selection = document.getSelection();
        // if caret is at the begining of the text node (0), remove previous element
        if (selection && selection?.anchorOffset === 0)
            selection?.anchorNode?.previousSibling?.parentNode?.removeChild(selection?.anchorNode?.previousSibling)
    }
}

/**
 * Show toast message base on request's response.
 * @param error 
 */
export const showToastMessageOnRequestError = (error, priotizedMessageToShow = '') => {
    if (priotizedMessageToShow) {
        toast.error(priotizedMessageToShow); // show the priotized message first.
        return;
    }

    if (error?.response) {
        const errorCode = error.response?.status;
        const syrfErrorCode = error.response?.data?.errorCode;
        const errorMessage = error.response?.data?.message || error.response?.data?.errorMessage;

        if ([AuthCode.INVALID_SESSION_TOKEN, AuthCode.EXPIRED_SESSION_TOKEN].includes(syrfErrorCode)) return;

        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        if (errorCode === 500) {
            toast.error(i18next.t(translations.general.oops_it_our_fault));
        } else if (errorCode === 404) {
            toast.error(i18next.t(translations.general.resource_is_not_found));
        } else {
            if (errorCode === 401) return;
            const serverMessage = error?.response?.data?.message;
            toast.error(serverMessage || i18next.t(translations.general.oops_an_unexpected_error_happended_when_performing_your_request));
        }
    } else {
        toast.error(i18next.t(translations.general.you_are_offline));
    }
}

/**
 * Format request's response promise.
 * @param requestPromise 
 * @returns Formatted promise response.
 */
export const formatServicePromiseResponse = (requestPromise): Promise<any> => {
    return requestPromise.then(response => {
        return {
            success: true,
            data: response?.data
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    });
}

/**
 * Parse search keyword.
 * @param keyword 
 * @returns parsed search keyword.
 */
export const parseKeyword = (keyword) => {
    // eslint-disable-next-line
    keyword = keyword.replace(/([\!\*\+\=\<\>\&\|\(\)\[\]\{\}\^\~\?\\/"])/g, "\\$1"); // escape special characters that will make the elastic search crash.
    keyword = keyword.replace(/(\bAND\b|\bOR\b|\bNOT\b)/g, function (match) {
        return match.toLowerCase();
    });
    // eslint-disable-next-line
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const { expression, processedKeyword } = addMultipleFieldCriteriaIfSearchByAllFields(keyword);
    const words = processedKeyword.trim().split(' ');
    let parsedWords: any[] = [];
    let result = '';

    words.forEach((word, index) => {
        word = word.trim();
        let splittedWord = word.split(':');
        if (splittedWord.length > 1 && supportedSearchCriteria.includes(splittedWord[0]) && index !== 0) {
            splittedWord.splice(0, 0, expression);
        }
        parsedWords.push(splittedWord);
    });

    parsedWords = parsedWords.flat().filter(word => word).filter(Boolean);

    parsedWords.forEach((word, i) => {
        let fuzziness = !specialChars.test(word) ? '~' : '';
        const nextWord = parsedWords[i + 1];
        word = word.trim();

        if (supportedSearchCriteria.includes(word)) {
            result += (word + ':(');
        } else {
            if (i === 0) {
                result += 'name:(';
            }

            if (nextWord === expression) {
                result += (word + fuzziness + ') ');
            }
            else {
                const optionalFuzziness = word !== expression ? fuzziness : '';
                if (typeof nextWord === 'undefined') {
                    result += (word + optionalFuzziness + ')')
                } else {
                    result += (word + optionalFuzziness + ' ');
                }
            }
        }
    });

    result = priotizePointForNameFieldIfExists(result, expression);

    return result.trim();
}

/**
 * Change all_fields criteria to all criteria.
 * @param keyword 
 * @returns 
 */
export const addMultipleFieldCriteriaIfSearchByAllFields = (keyword) => {
    if (keyword.includes('all_fields')) {
        const parseResults: string[] = [];
        keyword = keyword.split(':')[1];
        supportedSearchCriteria.filter(criteria => criteria !== 'all_fields').forEach(criteria => {
            parseResults.push(criteria + ':');
            parseResults.push(keyword);
        });

        return { expression: 'OR', processedKeyword: parseResults.join(' ') };
    }

    return { expression: 'AND', processedKeyword: keyword };
}

/**
 * Priotize point for name criteria.
 * @param result 
 * @returns search keyword.
 */
export const priotizePointForNameFieldIfExists = (result, expression) => {
    const parsedResult: string[] = [];
    const otherCriteriaInTheKeyword = supportedSearchCriteria.filter(criteria => criteria !== 'name').some(criteria => {
        return result.includes(criteria);
    });
    if (result.includes('name:') && otherCriteriaInTheKeyword) {
        const splittedSearchWordPhrases = result.split(` ${expression} `);
        splittedSearchWordPhrases.forEach(phrase => {
            if (phrase.includes('name:')) {
                parsedResult.push('(' + phrase + ')^3');
            } else {
                parsedResult.push('(' + phrase + ')^2');
            }
        });
    }
    if (parsedResult.length > 0)
        return parsedResult.join(` ${expression} `);

    return result;
}

export const checkIfIsSafari = () => {
    return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') === -1 &&
        navigator.userAgent.indexOf('FxiOS') === -1;

}

export const unregisterPushSubscription = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (reg) {
            reg.pushManager.getSubscription().then(function (subscription) {
                if (subscription)
                    subscription.unsubscribe().catch(function (e) {
                        console.error(e);
                    });
            })
        });
    }
}

export const canStreamToExpedition = (id: string | undefined, source: string, status: string, isPrivate: boolean) => {
    return id && source === RaceSource.SYRF && status === RaceStatus.ON_GOING && !isPrivate;
}

export const handleGoBack = (history) => {
    if (history.action !== "POP") {
        history.goBack();
    } else {
        history.push('/');
    }
}

export const getBoatNameFromVesselParticipantObject = (vesselparticipant) => {
    return vesselparticipant?.vessel?.publicName || '';
}

export const flat = (obj, out) => {
    if (obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] == 'object' && obj[key]?.constructor !== Array) {
                out = flat(obj[key], out) //recursively call for nesteds
            } else {
                if (obj[key] !== undefined)
                    out[key] = obj[key] //direct assign for values
            }
        });
    }

    return out;
}

export const renderRaceStartTime = (value, t) => {
    console.log(value);
    const valueAsMomentObject = moment(value);
    if (valueAsMomentObject.isValid()) {
        return valueAsMomentObject.format(TIME_FORMAT.date_text);
    }

    return t(translations.event_detail_page.this_race_is_postponed_therefore_its_start_time_is_not_available);
}

export const handleOnBoatSelected = (boats, boatIdToFilter, formInstance) => {
    const boat = boats.find(boat => boat.id === boatIdToFilter);
    if (boat.sailNumber) {
        formInstance.setFieldsValue({
            sailNumber: boat.sailNumber
        });
    } else {
        formInstance.setFieldsValue({
            sailNumber: ''
        });
    }
}

export const renderRequirementBasedOnEventKey = (t, key) => {
    switch (key) {
        case 'requireEmergencyContact':
            return t(translations.my_event_list_page.emergency_contact);
        case 'requireCovidCertificate':
            return t(translations.my_event_list_page.covid_vaccination);
        case 'requireMedicalProblems':
            return t(translations.my_event_list_page.medical_problems);
        case 'requireFoodAllergies':
            return t(translations.my_event_list_page.food_allergies);
        case 'requireImmigrationInfo':
            return t(translations.my_event_list_page.immigration_info);
    }
}

export const truncateName = (text, size = 50) => {
    if (!text) return renderEmptyValue(null);
    return text.length > size ? `${text.substring(0, 50)}...` : text;
}

export const retryWrapper = (axios, options) => {
    const max_time = options.retry_time;
    let counter = 0;
    axios.interceptors.response.use(null, (error) => {
        /** @type {import("axios").AxiosRequestConfig} */
        const config = error.config
        if (counter < max_time) {
            counter++
            return new Promise((resolve) => {
                resolve(axios(config))
            })
        }
        return Promise.reject(error)
    })
}

export const navigateToProfile = (e, item, history) => {
    e.stopPropagation();
    if (item.profile)
        history.push(`/profile/${item.profile.id}`);
}

export const checkIfLocationIsValid = (lon, lat) => {
    return lon !== null && lon !== undefined && lat !== null && lat !== undefined
}