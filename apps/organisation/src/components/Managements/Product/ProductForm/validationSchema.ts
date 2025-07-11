import { ERROR_MESSAGES } from '@ethos-frontend/constants';
import * as Yup from 'yup';
import i18n from 'i18next';

export const productSchema = Yup.object().shape({
  categoryId: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  name: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  type: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  calory: Yup.number().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  characteristicIds: Yup.array()
    .min(1, i18n.t(ERROR_MESSAGES.AT_LEAST_ONE))
    .required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  taxCode: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  price: Yup.number().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  discount: Yup.number()
    .max(Yup.ref('price'), 'Discount ≤ Price')
    .required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  description: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
  availability: Yup.array()
    .of(
      Yup.object({
        value: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
        label: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
      })
        .required(i18n.t(ERROR_MESSAGES.REQUIRED))
        .defined(),
    )
    .min(1, i18n.t(ERROR_MESSAGES.AT_LEAST_ONE))
    .default([]),

  extras: Yup.array()
    .of(
      Yup.object({
        groupName: Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)),
        isRequired: Yup.boolean(),
        isMultiple: Yup.boolean(),
        products: Yup.array()
          .of(Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)).defined())
          .min(1, i18n.t(ERROR_MESSAGES.AT_LEAST_ONE))
          .required(i18n.t(ERROR_MESSAGES.REQUIRED)),
      })
        .required(i18n.t(ERROR_MESSAGES.REQUIRED))
        .defined(),
    )
    .ensure()
    .default([]),
  files: Yup.array()
    .of(Yup.string().required(i18n.t(ERROR_MESSAGES.REQUIRED)).defined())
    .required(i18n.t(ERROR_MESSAGES.REQUIRED))
    .default([]),
});

export const comboSchema = productSchema.shape({
  combos: Yup.array()
    .of(
      Yup.object({
        type: Yup.string()
          .oneOf(['Single', 'Multiple'] as const)
          .required(i18n.t(ERROR_MESSAGES.REQUIRED)),
        product: Yup.string().when('type', {
          is: 'Single',
          then: (schema) =>
            schema.required(i18n.t(ERROR_MESSAGES.AT_LEAST_ONE)),
          otherwise: (schema) => schema.notRequired(),
        }),
        comboTitle: Yup.string().when('type', {
          is: 'Multiple',
          then: (schema) =>
            schema.required(i18n.t(ERROR_MESSAGES.COMBO_TITLE_REQUIRED)),
          otherwise: (schema) => schema.notRequired(),
        }),

        options: Yup.array().when('type', {
          is: 'Multiple',
          then: (schema) =>
            schema
              .of(
                Yup.object({
                  comboProduct: Yup.string().required(
                    i18n.t(ERROR_MESSAGES.REQUIRED),
                  ),
                  comboProductPrice: Yup.number()
                    .required(i18n.t(ERROR_MESSAGES.REQUIRED))
                    .typeError(i18n.t(ERROR_MESSAGES.REQUIRED))
                    .min(0, 'Price must be greater than or equal to 0'),
                })
                  .required(i18n.t(ERROR_MESSAGES.REQUIRED))
                  .defined(),
              )
              .required(i18n.t(ERROR_MESSAGES.REQUIRED))
              .min(1, i18n.t(ERROR_MESSAGES.AT_LEAST_ONE)),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
        .required(i18n.t(ERROR_MESSAGES.REQUIRED))
        .defined(),
    )
    .required(i18n.t(ERROR_MESSAGES.REQUIRED)),
});
