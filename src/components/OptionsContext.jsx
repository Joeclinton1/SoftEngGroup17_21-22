import * as React from 'react';

export const defaultOptions = {
    fontSize: 20,
    chatColour: 'b',
    lang: 0,
    numResults: 1,
    isSummarised: 1
}

export const OptionsContext = React.createContext(defaultOptions);