class KDTranslator {
    /**
     * Initialization options that can be passed to the `new KDTranslator()` constuctor.
     * @typedef {object} KDTranslatorOptions
     * @property {string} inputLanguage
     * @property {string} outputLanguage
     */

    /**
     * Object describing individual translations.
     * @typedef {object} KDTranslation
     * @property {string} inputLanguage
     * @property {string} outputLanguage
     * @property {string} inputText
     * @property {string} outputText
     */

     /**
      * Uses ISO 639-1 language codes.
      * @param {KDTranslatorOptions} options 
      */
    constructor(options) {

        const _translations = []
        const _options = {
            inputLanguage: 'auto',
            outputLanguage: 'es',
        }

        /**
         * Check the validity of a language name or code. Used internally but can also be called as a pre-check.
         * @param {string} target - Target language code or language name to check for validity.
         * @returns {(string|boolean)} Language code or `false`.
         */
        this.checkLanguageCode = target => {
            if (target && typeof target === 'String') {
                target = target.toLowerCase()
                if (KDTranslator.languageCodes[target]) return target // return if the param is a valid language code
                const keys = Object.keys(KDTranslator.languageCodes).filter(key => {
                    if (typeof KDTranslator.languageCodes[key] !== 'string') return false
                    return KDTranslator.languageCodes[key].toLowerCase() === target
                })
                return keys[0] ? keys[0] : false // return if the param is a valid language name
            } else return false // return false if param is not valid
        }

        /**
         * Set the input language. Retained until changed. Default is `auto`.
         * @param {string} language - Language name or code.
         */
        this.setInputLanguage = language => {
            const lang = this.checkLanguageCode(language)
            if (lang) _options.inputLanguage = lang
        }

        /**
         * Set the output language. Retained until changed. Default is `es` (Spanish).
         * @param {string} language - Language name or code.
         */
        this.setOutputLanguage = language => {
            const lang = this.checkLanguageCode(language)
            if (lang) _options.outputLanguage = lang
        }

        /**
         * Set the input and/or output languages via a `KDTranslatorOptions` object.
         * @param {KDTranslatorOptions} options
         */
        this.setOptions = options => {
            if (options) {
                if (options.inputLanguage) this.setInputLanguage(options.inputLanguage)
                if (options.outputLanguage) this.setOutputLanguage(options.outputLanguage)
            }
            this.options()
        }

        /** @returns {KDTranslatorOptions} Current input and output codes. */
        this.options = _ => _options
        /** @returns {[KDTranslation]} Array of all past results as `KDTranslation` objects. */
        this.translations = _ => _translations
        /** @returns {number} Number of available past results. */
        this.count = _ => _translations.length
        /** Rest the store of past translations. Unrecoverable. */
        this.clear = _ => _translations = []
        /** @returns {KDTranslation} Get the latest translation as a `KDTranslation` object. */
        this.latest = _ => {
            if (_translations.length > 0) return _translations[_translations.length - 1]
            else return null
        }

        /**
         * Translate the input text.
         * @param {string} inputText - Text that should be translated.
         * @param {function=} callback - Optional. Callback function called after translation attempt.
         * @param {KDTranslatorOptions=} options - Optional. Set the translator options prior to translating. Retained until changed.
         */
        this.translate = (inputText, callback, options) => {
            if (options) this.options(options)

            if (inputText) {
                try {
                    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + _options.inputLanguage + "&tl=" + _options.outputLanguage + "&dt=t&q=" + encodeURI(inputText)
                    const xhr = new XMLHttpRequest()
                    xhr.open('GET', url)
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            const result = JSON.parse(xhr.response)[0]
                            let translation = ''

                            if (result) result.forEach(element => {
                                if (element[0]) translation += element[0]
                            })

                            const response = {
                                inputLanguage: _options.inputLanguage,
                                outputLanguage: _options.outputLanguage,
                                inputText: inputText,
                                outputText: translation,
                            }

                            _translations.push(response)

                            if (callback) callback(true)
                        } else {
                            console.log('translation error')
                            console.log(xhr.status)
                            if (callback) callback(false)
                        }
                    }
                    xhr.send()
                } catch {
                    console.log('translation error: invalid param')
                    if (callback) callback(false)
                }
            } else {
                console.log('provide valid source text')
            }
        }
        // END this.translate()

        const init = (_ => {
            if (options) this.options(options)
        })()

    }
    // END CONSTRUCTOR

    /**
     * ISO 639-1 language codes and names.
     */
    static get languageCodes() {
        return {
            'auto': 'Automatic',
            'af': 'Afrikaans',
            'sq': 'Albanian',
            'am': 'Amharic',
            'ar': 'Arabic',
            'hy': 'Armenian',
            'az': 'Azerbaijani',
            'eu': 'Basque',
            'be': 'Belarusian',
            'bn': 'Bengali',
            'bs': 'Bosnian',
            'bg': 'Bulgarian',
            'ca': 'Catalan',
            'ceb': 'Cebuano',
            'ny': 'Chichewa',
            'zh-cn': 'Chinese (Simplified)',
            'zh-tw': 'Chinese (Traditional)',
            'co': 'Corsican',
            'hr': 'Croatian',
            'cs': 'Czech',
            'da': 'Danish',
            'nl': 'Dutch',
            'en': 'English',
            'eo': 'Esperanto',
            'et': 'Estonian',
            'tl': 'Filipino',
            'fi': 'Finnish',
            'fr': 'French',
            'fy': 'Frisian',
            'gl': 'Galician',
            'ka': 'Georgian',
            'de': 'German',
            'el': 'Greek',
            'gu': 'Gujarati',
            'ht': 'Haitian Creole',
            'ha': 'Hausa',
            'haw': 'Hawaiian',
            'iw': 'Hebrew',
            'hi': 'Hindi',
            'hmn': 'Hmong',
            'hu': 'Hungarian',
            'is': 'Icelandic',
            'ig': 'Igbo',
            'id': 'Indonesian',
            'ga': 'Irish',
            'it': 'Italian',
            'ja': 'Japanese',
            'jw': 'Javanese',
            'kn': 'Kannada',
            'kk': 'Kazakh',
            'km': 'Khmer',
            'ko': 'Korean',
            'ku': 'Kurdish (Kurmanji)',
            'ky': 'Kyrgyz',
            'lo': 'Lao',
            'la': 'Latin',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'lb': 'Luxembourgish',
            'mk': 'Macedonian',
            'mg': 'Malagasy',
            'ms': 'Malay',
            'ml': 'Malayalam',
            'mt': 'Maltese',
            'mi': 'Maori',
            'mr': 'Marathi',
            'mn': 'Mongolian',
            'my': 'Myanmar (Burmese)',
            'ne': 'Nepali',
            'no': 'Norwegian',
            'ps': 'Pashto',
            'fa': 'Persian',
            'pl': 'Polish',
            'pt': 'Portuguese',
            'ma': 'Punjabi',
            'ro': 'Romanian',
            'ru': 'Russian',
            'sm': 'Samoan',
            'gd': 'Scots Gaelic',
            'sr': 'Serbian',
            'st': 'Sesotho',
            'sn': 'Shona',
            'sd': 'Sindhi',
            'si': 'Sinhala',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'so': 'Somali',
            'es': 'Spanish',
            'su': 'Sundanese',
            'sw': 'Swahili',
            'sv': 'Swedish',
            'tg': 'Tajik',
            'ta': 'Tamil',
            'te': 'Telugu',
            'th': 'Thai',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'uz': 'Uzbek',
            'vi': 'Vietnamese',
            'cy': 'Welsh',
            'xh': 'Xhosa',
            'yi': 'Yiddish',
            'yo': 'Yoruba',
            'zu': 'Zulu',
        }
    }
    // END LANGUAGE CODES
}
// END CLASS