import React from 'react';

export const ControlledInput = React.lazy(() =>
  import('./ControlledInput').then((module) => ({
    default: module.ControlledInput,
  }))
);

export const GridContainer = React.lazy(() =>
  import('./Grid').then((module) => ({
    default: module.GridContainer,
  }))
);

export const ControlledDropdown = React.lazy(() =>
  import('./ControlledDropdown').then((module) => ({
    default: module.ControlledDropdown,
  }))
);

export const Card = React.lazy(() =>
  import('./Card').then((module) => ({
    default: module.Card,
  }))
);

export const ControlledRadio = React.lazy(() =>
  import('./ControlledRadio').then((module) => ({
    default: module.ControlledRadio,
  }))
);

export const ControlledCheckbox = React.lazy(() =>
  import('./ControlledCheckbox').then((module) => ({
    default: module.ControlledCheckbox,
  }))
);

export const PhoneInputWithCountry = React.lazy(() =>
  import('./PhoneInputWithCountry').then((module) => ({
    default: module.PhoneInputWithCountry,
  }))
);

export const FormFields = React.lazy(() =>
  import('./FormFields').then((module) => ({
    default: module.FormFields,
  }))
);

export const LoginForm = React.lazy(() =>
  import('./LoginForm').then((module) => ({
    default: module.LoginForm,
  }))
);

export const LanguageDropdown = React.lazy(() =>
  import('./LanguageDropdown').then((module) => ({
    default: module.LanguageDropdown,
  }))
);

export type { FormFieldProps } from "./FormFields";