import i18next from 'i18next';
import * as L from 'leaflet';
import { translations } from 'locales/translations';
import moment from 'moment-timezone';
import { CRITERIA_TO_RAW_CRITERIA, formatterSupportedSearchCriteria, RAW_CRITERIA_TO_CRITERIA, supportedSearchCriteria } from 'utils/constants';

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
 * Convert JS File image to base64
 * @param file 
 * @returns new Promise
 */
export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

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
 * Insert new ~3 when search.
 * @param keyword 
 * @returns 
 */
export const insert3ToLastWordWhenSearch = (keyword) => {
    let value = keyword;
    let lastWord: any = keyword.match(/(?:\s|^)([\S]+)$/i);
    if (lastWord) {
        lastWord = lastWord[0];
    }

    if (lastWord && !Array.isArray(lastWord) && !lastWord!.includes('~3')) {
        value = value.substr(0, value.length) + '~3' + value.substr(value.length);
    }

    return value;
}
/**
 * Insert 3~ between each word when append suggestion
 * @param stringOfWords 
 * @returns 
 */
export const insert3BetweenEachWord = (stringOfWords) => {
    //eslint-disable-next-line
    const format = /[ `!@#$%^&*()+\-=\[\]{};'"\\|,.<>\/?~]/;
    const formattedWord: any[] = [];

    stringOfWords.split(' ').map(word => {
        if (!format.test(word)) {
            formattedWord.push(word);
        }
        return word;
    });

    return formattedWord.join('~3 ') + '~3';
}

/**
 * Remove all ~3 after word.
 * @param stringOfWords 
 * @returns 
 */
export const remove3AfterEachWord = (stringOfWords) => {
    return stringOfWords.split(' ').map((word, index) => {
        if (word.includes('~3')) {
            word = word.slice(0, -2);
        }
        return word;
    }).join(' ');
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

export const replaceCriteriaWithPilledCriteria = (string) => {
    supportedSearchCriteria.forEach(criteria => {
        string = string.replace(criteria + ':', `<span contenteditable="false" class="pill">${RAW_CRITERIA_TO_CRITERIA[criteria]}:</span>`);
    });

    return string;
}

export const replaceFormattedCriteriaWithRawCriteria = (string): string => {
    formatterSupportedSearchCriteria.forEach(criteria => {
        string = string.replace(criteria, CRITERIA_TO_RAW_CRITERIA[criteria]);
    });

    return string;
}

export const removeWholeTextNodeOnBackSpace = (e) => {
    if (e.key === "Backspace") {
        var selection = document.getSelection();
        // if caret is at the begining of the text node (0), remove previous element
        if (selection && selection?.anchorOffset === 0)
            selection?.anchorNode?.previousSibling?.parentNode?.removeChild(selection?.anchorNode?.previousSibling)
    }
}

export const formatServicePromiseResponse = (requestPromise) => {
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