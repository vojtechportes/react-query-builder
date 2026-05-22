import React from 'react';
import { BuilderRef } from './types';

export const useBuilderRef = (): BuilderRef => React.useRef(null);
