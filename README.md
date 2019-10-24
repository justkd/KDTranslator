# KDTranslator

v 1.0  
Copyright 2019 justKD  
MIT License  

Vanilla JS helper for managing translation calls to the Google translate public client.

## Install
via CDN:  
```
<script src="https://cdn.jsdelivr.net/gh/justKD/KDTranslator@master/KDTranslator.min.js"></script>
```

## Try It Out
https://codepen.io/justKD/pen/YzzVryO

## Example App
https://justkd.github.io/KDTranslator/demo/index.html

## Basic Use
Create a `new KDTranslator` and set the output language (input language defaults to `auto`). The success status of the call can be accessed in the optional callback functions parameter. The callback function will be called on either success or failure, so be sure to check the status.
```
const translator = new KDTranslator('spanish')
const inputText = 'Translate this text.'

translator.translate(inputText, success => {
    if (success) console.log(translator.latest().outputText)
    else console.log('something went wrong')
})
```
## Extended Use
`KDTranslator` stores translation calls as an array of `KDTranslation` objects. The last successful translation can be directly accessed with the `.latest()` instance method.
```
const allTranslations = translator.translations()
console.log(allTranslations)

const last = translator.latest()
console.log(last)
```

Set the input/output language options.
```
translator.setOptions({
    inputLanguage: 'auto',
    outputLanguage: 'french',
})

translator.setInputLanguage('german')
translator.setOutputLanguage('english')
```

Current options and translation count can be queried, and the stored translations can be cleared. You can also access available language codes for reference.
```
const options = translator.options()
const count = translator.count()
translator.clear()
console.log(KDTranslator.languageCodes)
```
