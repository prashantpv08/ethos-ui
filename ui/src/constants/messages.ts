import i18n from 'i18next';

export enum ERROR_MESSAGES {
  REQUIRED = 'errors.requiredField',
  AT_LEAST_ONE = 'errors.atleastOneSelection',
  GENERAL = 'errors.general',
  NOT_AUTHORIZED = 'errors.notAuthorized',
  NO_SPACES_ALLOWED = 'errors.noSpacesAllowed',
  IN_USE = 'errors.cannotDelete',
  EMAIL = 'errors.invalidEmail',
  TIP_ZERO = 'errors.tipAtleastZero',
  SHOULD_NUMBER = 'errors.shouldBeNumber',
  CHARACTER_LIMIT = 'errors.passwordErrors.characterLimit',
  LOWERCASE = 'errors.passwordErrors.lowerCase',
  UPPERCASE = 'errors.passwordErrors.upperCase',
  ONE_NUMBER = 'errors.passwordErrors.oneNumber',
  SPECIAL_CHARACTER = 'errors.passwordErrors.specialCharacter',
  PASSWORD_MATCH = 'errors.passwordMatch',
  EMAIL_NOT_FOUND = 'errors.emailNotFound',
  INVALID_PASSWORD = 'errors.invalidPassword',
  ORDER_STATUS = 'errors.orderStatus',
  ALREADY_EXIST = 'errors.recordAlreadyExist',
  NOT_FOUND = 'errors.recordNotFound',
  UPLOAD_ONE_IMAGE = 'errors.uploadAtleastOneImage',
  COMBO_TITLE_REQUIRED = 'errors.comboTitleRquired',
  DISCOUNT_MUST_NUMBER = 'errors.discountNumber',
  SHOULD_GREATER = 'erros.disountGreater',
}

export enum SUCCESS_MESSAGES {
  PASSWORD_UPDATE = 'success.passwordUpdate',
  PROFILE_UPDATED = 'success.profileUpdated',
  LANGUAGE_UPDATED = 'success.languageUpdated',
  INVENTORY_UPDATED = 'success.inventoryUpdated',
  INVENTORY_REPORT_DOWNLOAD = 'success.inventoryReport',
  EMPLOYEE_NEW_PASSWORD = 'success.employeeNewPassword',
  RESTAURANT_CLOSED = 'success.restaurantClosed',
  RESTAURANT_OPEN = 'success.restaurantOpen',
  LOGOUT = 'success.logout',
  RESET_PASSWORD = 'success.resetPassword',
  ORDER_REPORT_DOWNLOAD = 'success.orderReport',
  LOGO_UPDATED_SUCCESSFULLY = 'success.logoUpdated'
}

export enum INFO_MESSAGES {
  ACCESS_DENIED = 'info.accessDenied',
  ACCCOUNT_APPROVAL_PENDING = 'info.accountApprovalPending',
}

export const SUCCESS_TEMPLATES = {
  added: (entity: string) => `${entity} ${i18n.t('success.added')}`,
  updated: (entity: string) => `${entity} ${i18n.t('success.updated')}`,
  deleted: (entity: string) => `${entity} ${i18n.t('success.deleted')}`,
  status: (entity: string, status: string) =>
    `${entity} ${i18n.t('success.hasBeen')} ${status} ${i18n.t('success.successfully')}`,
  payment: (entity: string) => `${i18n.t('success.payment')} ${entity}`,
} as const;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const noSpace = /^\S*$/;
