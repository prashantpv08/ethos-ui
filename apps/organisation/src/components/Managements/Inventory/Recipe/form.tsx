import { useEffect, useMemo, useState } from 'react';
import { Header } from '../../../Common';
import { ControlledDropdown } from '@ethos-frontend/components';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Heading,
  Iconbutton,
  Paragraph,
  PrimaryButton,
} from '@ethos-frontend/ui';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_RECEIPE,
  UPDATE_RECEIPE,
} from '@organisation/api/mutations/Receipe';
import {
  GET_RECEIPE,
  GET_RECEIPE_BY_ID,
} from '@organisation/api/queries/Receipe';
import { ControlledInput, GridContainer } from '@ethos-frontend/components';
import { useRestQuery } from '@ethos-frontend/hook';
import {
  API_URL,
  ERROR_MESSAGES,
  getWastePercentage,
} from '@ethos-frontend/constants';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useProductDropdown } from '../../../../hooks/useProductList';
import { Alert } from '@mui/material';
import { t } from 'i18next';

const validationSchema = Yup.object().shape({
  product: Yup.array()
    .min(1, t(ERROR_MESSAGES.AT_LEAST_ONE))
    .required(t(ERROR_MESSAGES.REQUIRED)),
  extras: Yup.array()
    .of(
      Yup.object().shape({
        rawMaterial: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
        qty: Yup.number()
          .required(t(ERROR_MESSAGES.REQUIRED))
          .typeError(t(ERROR_MESSAGES.REQUIRED)),
        wasteByPercentage: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
        percentage: Yup.number()
          .required(t(ERROR_MESSAGES.REQUIRED))
          .typeError(t(ERROR_MESSAGES.REQUIRED)),
        unit: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
      }),
    )
    .required(),
});

interface Options {
  label: string;
  value: string;
}

interface RawMaterial {
  _id: string;
  name: string;
  uom: {
    code: string;
    description: string;
  };
}

interface RecipeFormValues {
  product: string[];
  extras: {
    rawMaterial: string;
    qty: number;
    wasteByPercentage: string;
    percentage: number;
    unit: string;
  }[];
}

export const RecipeForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isDesktop, isMobile } = useResponsive();
  const wastePercentage = getWastePercentage();

  const [product, setProduct] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<Options[]>([]);
  const [rawMaterialsData, setRawMaterialsData] = useState<any[]>([]);
  const [rawOptions, setRawOptions] = useState<Options[]>([]);

  const {
    data: productDropdownData,
    refetch: loadProducts,
    isLoading: productsLoading,
  } = useProductDropdown();

  useEffect(() => {
    if (productDropdownData?.data) {
      setProductOptions(
        productDropdownData.data.map((ele: any) => ({
          label: ele.name,
          value: ele._id,
        })),
      );
    }
  }, [productDropdownData]);

  useQuery(GET_RECEIPE_BY_ID, {
    variables: {
      recipeId: params.id,
    },
    skip: !params.id,
    onCompleted: (res) => {
      const data = res.recipe.data.ingredients.map(
        (ele: {
          rawMaterialId: string;
          qty?: number | undefined;
          waste: {
            valueType: string;
            value: number;
            uomId: string;
            uom: string;
          };
        }) => {
          return {
            rawMaterial: ele.rawMaterialId,
            qty: ele.qty,
            wasteByPercentage:
              ele.waste.valueType === 'Value'
                ? 'waste-by-qty'
                : 'waste-by-percentage',
            percentage: ele.waste.value,
            unit: ele.waste.uomId,
          };
        },
      );
      setProduct(res.recipe.data.productId);
      reset({ product: res.recipe.data.productId, extras: data });
      loadProducts();
      loadRawMaterials();
    },
  });

  const { refetch: loadRawMaterials, isLoading: rawLoading } = useRestQuery(
    'fetch-raw',
    API_URL.rawMaterialList,
    {
      enabled: false,
      onSuccess: (res) => {
        const opts = res.data.map((ele: RawMaterial) => ({
          label: ele.name,
          value: ele._id,
        }));
        setRawOptions(opts);
        setRawMaterialsData(res.data);
      },
    },
  );

  const [addReceipe] = useMutation(ADD_RECEIPE, {
    onCompleted: () => {
      navigate('/receipeCard');
    },
    refetchQueries: [GET_RECEIPE],
  });

  const [updateReceipe] = useMutation(UPDATE_RECEIPE, {
    onCompleted: () => {
      navigate('/receipeCard');
    },
    refetchQueries: [GET_RECEIPE],
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      product: [],
      extras: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'extras',
  });

  const rawMaterialValues = watch('extras');

  const rawMaterialsMap = useMemo(() => {
    const map: { [key: string]: RawMaterial } = {};
    rawMaterialsData.forEach((ele: RawMaterial) => {
      map[ele._id] = ele;
    });
    return map;
  }, [rawMaterialsData]);

  const getUomValue = (
    rawMaterialValues: { rawMaterial: string; uom?: { code: string } }[],
    rawMaterialsMap: { [key: string]: RawMaterial },
  ) => {
    rawMaterialValues.forEach((item, index) => {
      const rawMaterialId = item.rawMaterial;
      const selectedRawMaterial = rawMaterialsMap[rawMaterialId];

      if (selectedRawMaterial) {
        const uomCode = selectedRawMaterial.uom?.code || '';
        setValue(`extras.${index}.unit`, uomCode);
      } else {
        setValue(`extras.${index}.unit`, '');
      }
    });
  };

  useEffect(() => {
    getUomValue(rawMaterialValues, rawMaterialsMap);
  }, [rawMaterialValues, rawMaterialsMap]);

  useEffect(() => {
    if (!params.id) {
      append({
        rawMaterial: '',
        qty: 0,
        wasteByPercentage: '',
        percentage: 0,
        unit: '',
      });
    }
  }, []);

  const onSubmit = (data: any) => {
    const ingredients: any = [];

    data.extras.map((ele: any) => {
      ingredients.push({
        qty: ele.qty,
        rawMaterialId: ele.rawMaterial,
        waste: {
          value: ele.percentage,
          valueType:
            ele.wasteByPercentage === 'waste-by-percentage'
              ? 'Percentage'
              : 'Value',
          uom: ele.unit,
        },
      });
    });

    const receipeData = {
      ingredients,
      productId: data.product,
    };

    if (params.id) {
      updateReceipe({
        variables: { params: { ...receipeData, id: params.id } },
      });
    } else {
      addReceipe({ variables: { data: receipeData } });
    }
  };

  const handleProductChange = (value: string | string[]) => {
    console.log(value, 'value');

    if (Array.isArray(value)) {
      setProduct(value);
    }
  };

  const handleProductOpen = () => {
    if (productOptions.length === 0) {
      loadProducts();
    }
  };

  const handleRawOpen = () => {
    if (rawOptions.length === 0) {
      loadRawMaterials();
    }
  };

  return (
    <>
      <Header
        title={`${params.id ? t('receipeCard.edit') : t('receipeCard.add')}`}
      />
      {!params.id ? (
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          {t('receipeCard.info')}
        </Alert>
      ) : null}
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {params.id ? (
          <>
            <Heading variant="h5" weight="medium">{t('receipeCard.selectedProducts')}</Heading>
            <Paragraph variant="h5" className='py-4'>
              {productOptions
                .filter((opt) => product.includes(opt.value))
                .map((opt) => opt.label)
                .join(', ') || t('noProduct')}
            </Paragraph>
          </>
        ) : (
          <GridContainer
            columns={getNumberOfCols({ isDesktop, isMobile, mobileCol: 1 })}
          >
            <ControlledDropdown
              name="product"
              control={control}
              placeholder={t('selectProduct')}
              options={productOptions}
              helperText={errors}
              errors={errors}
              onChange={handleProductChange}
              value={product}
              onOpen={handleProductOpen}
              loading={productsLoading}
              multiple
            />
          </GridContainer>
        )}

        {fields.map((field, index) => (
          <div className="py-2" key={field.id}>
            <div className="flex gap-2 items-center py-4">
              <Heading variant="h5">
                {t('receipeCard.ingredient')} {index + 1}
              </Heading>
              {fields.length > 1 && (
                <Iconbutton
                  iconColor="red"
                  name="delete"
                  onClick={() => remove(index)}
                />
              )}
            </div>
            <GridContainer columns={12}>
              <div
                data-span={getNumberOfCols({ isDesktop, isMobile })}
                data-item
                className="flex gap-2"
              >
                <ControlledDropdown
                  name={`extras.${index}.rawMaterial`}
                  control={control}
                  placeholder={t('selectRawMaterial')}
                  options={rawOptions}
                  helperText={errors}
                  errors={errors}
                  value={watch(`extras.${index}.rawMaterial`)}
                  onChange={(value) => {
                    setValue(`extras.${index}.rawMaterial`, value as string);
                    const selectedRawMaterial =
                      rawMaterialsMap[value as string];
                    if (selectedRawMaterial) {
                      const uomCode = selectedRawMaterial?.uom?.code || '';
                      setValue(`extras.${index}.unit`, uomCode);
                    } else {
                      setValue(`extras.${index}.unit`, '');
                    }
                  }}
                  onOpen={handleRawOpen}
                  loading={rawLoading}
                />

                <ControlledInput
                  name={`extras.${index}.unit`}
                  control={control}
                  label={t('units.title')}
                  helperText={errors}
                  errors={errors}
                  type="text"
                  disabled
                />
              </div>
              <div
                data-span={getNumberOfCols({ isDesktop, isMobile })}
                data-item
              >
                <ControlledInput
                  type="number"
                  name={`extras[${index}].qty`}
                  control={control}
                  label={t('quantity')}
                  helperText={errors}
                  errors={errors}
                  fullWidth
                />
              </div>
              <div
                data-span={getNumberOfCols({ isDesktop, isMobile })}
                data-item
              >
                <ControlledDropdown
                  name={`extras[${index}].wasteByPercentage`}
                  control={control}
                  placeholder={t('receipeCard.wastePercentage')}
                  options={wastePercentage}
                  helperText={errors}
                  errors={errors}
                  value={fields[index].wasteByPercentage}
                  onChange={(value) => {
                    setValue(
                      `extras.${index}.wasteByPercentage`,
                      value as string,
                    );
                  }}
                />
              </div>
              <div
                data-span={getNumberOfCols({ isDesktop, isMobile })}
                data-item
              >
                <ControlledInput
                  type="number"
                  name={`extras[${index}].percentage`}
                  control={control}
                  label={t('receipeCard.waste')}
                  helperText={errors}
                  errors={errors}
                  fullWidth
                />
              </div>
            </GridContainer>
          </div>
        ))}
        <div className="flex items-center justify-between pt-4">
          <PrimaryButton
            variant="outlined"
            onClick={() =>
              append({
                rawMaterial: '',
                qty: 0,
                wasteByPercentage: '',
                percentage: 0,
                unit: '',
              })
            }
          >
            {t('receipeCard.addIngredient')}
          </PrimaryButton>

          <PrimaryButton type="submit">
            {params.id ? t('update') : t('submit')}
          </PrimaryButton>
        </div>
      </form>
    </>
  );
};
