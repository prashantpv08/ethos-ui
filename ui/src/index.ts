import React from 'react';

export const TextField = React.lazy(() =>
  import('./lib/textfield').then((module) => ({
    default: module.TextField,
  }))
);

export const Link = React.lazy(() =>
  import('./lib/link').then((module) => ({
    default: module.Link,
  }))
);

export const Select = React.lazy(() =>
  import('./lib/select').then((module) => ({
    default: module.Select,
  }))
);

export const EOThemeProvider = React.lazy(() =>
  import('./lib/theme').then((module) => ({
    default: module.default,
  }))
);

export const Modal = React.lazy(() =>
  import('./lib/modal').then((module) => ({
    default: module.Modal,
  }))
);

export const Iconbutton = React.lazy(() =>
  import('./lib/iconButton').then((module) => ({
    default: module.Iconbutton,
  }))
);

export const Counter = React.lazy(() =>
  import('./lib/counter').then((module) => ({
    default: module.Counter,
  }))
);

export const AutoComplete = React.lazy(() =>
  import('./lib/autocomplete').then((module) => ({
    default: module.AutoComplete,
  }))
);

export const Checkbox = React.lazy(() =>
  import('./lib/checkbox').then((module) => ({
    default: module.Checkbox,
  }))
);

export const Radio = React.lazy(() =>
  import('./lib/radio').then((module) => ({
    default: module.Radio,
  }))
);

export const Switch = React.lazy(() =>
  import('./lib/switch').then((module) => ({
    default: module.Switch,
  }))
);

export const Heading = React.lazy(() =>
  import('./lib/typography').then((module) => ({
    default: module.Heading,
  }))
);

export const Label = React.lazy(() =>
  import('./lib/typography').then((module) => ({
    default: module.Label,
  }))
);

export const Paragraph = React.lazy(() =>
  import('./lib/typography').then((module) => ({
    default: module.Paragraph,
  }))
);

export const Drawer = React.lazy(() =>
  import('./lib/drawer').then((module) => ({
    default: module.Drawer,
  }))
);

export const Tabs = React.lazy(() =>
  import('./lib/tab').then((module) => ({
    default: module.Tabs,
  }))
);

export const Chip = React.lazy(() =>
  import('./lib/chip').then((module) => ({
    default: module.Chip,
  }))
);

export const Snackbar = React.lazy(() =>
  import('./lib/snackbar').then((module) => ({
    default: module.Snackbar,
  }))
);

export const Table = React.lazy(() =>
  import('./lib/table').then((module) => ({
    default: module.Table,
  }))
);

export const Stepper = React.lazy(() =>
  import('./lib/stepper').then((module) => ({
    default: module.Stepper,
  }))
);

export const Textarea = React.lazy(() =>
  import('./lib/textarea').then((module) => ({
    default: module.TextareaAutosize,
  }))
);

export const Tooltip = React.lazy(() =>
  import('./lib/tooltip').then((module) => ({
    default: module.Tooltip,
  }))
);

export const DateTimeRangePicker = React.lazy(() =>
  import('./lib/dateTimeRangePicker').then((module) => ({
    default: module.DateTimeRangePicker,
  }))
);

export const Dailog = React.lazy(() =>
  import('./lib/dialog').then((module) => ({
    default: module.Dialog,
  }))
);

export const PrimaryButton = React.lazy(() =>
  import('./lib/primaryButton').then((module) => ({
    default: module.PrimaryButton,
  }))
);

export const DateRangePicker = React.lazy(() =>
  import('./lib/dateRangePicker').then((module) => ({
    default: module.DateRangePicker,
  }))
);