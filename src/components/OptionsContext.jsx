import * as React from 'react';
import options from '../data/options.json';

export const defaultOptions = options
export const OptionsContext = React.createContext(defaultOptions);