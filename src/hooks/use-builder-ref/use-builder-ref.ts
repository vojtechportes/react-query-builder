import React from 'react';
import { BuilderRef } from './types';
import { createBuilderRef } from './utils/create-builder-ref.util';

export const useBuilderRef = (): BuilderRef => React.useMemo(createBuilderRef, []);
