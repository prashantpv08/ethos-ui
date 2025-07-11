import { useEffect, useState } from 'react';
import { Header } from '../../../Common';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { uploadImages } from '../../../../utils/uploadImage';
import {
  ADD_COMBO_PRODUCT,
  UPDATE_COMBO_PRODUCT,
} from '@organisation/api/mutations/ProductManagement';
import {
  GET_ALL_PRODUCT_LIST,
  GET_COMBOS_DETAIL,
} from '@organisation/api/queries/ProductManagement';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { Card, GridContainer } from '@ethos-frontend/components';
import { BasicDetails } from '../ProductForm/basicDetails';
import { ExtraDetails } from '../ProductForm/extraDetails';
import { comboSchema } from '../ProductForm/validationSchema';
import { useFileUpload, useFinalPrice, useStepForm } from '../../../../hooks';
import { FileUploadSection } from '../../../Common/FileUploadSection/fileUploadSection';
import { CommonTabs } from '../ProductForm/commonTabs';
import { ComboDetailsProps, ComboFormValues } from '../ProductForm/formTypes';
import { deleteImages } from '../../../../utils/deleteImage';
import { useTranslation } from 'react-i18next';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';

interface ComboProductState {
  [index: number]: string;
}

export const CombosForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDesktop, isMobile } = useResponsive();
  const { id } = useParams();
  const {
    step: tabValue,
    setStep: setTabValue,
    nextStep,
    goToStep,
  } = useStepForm('1');

  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const [filesChanged, setFilesChanged] = useState(false);

  const [productList, setProductList] = useState<
    { value: string; label: string }[]
  >([]);

  const [category, setCategory] = useState<string>('');
  const [comboType, setComboType] = useState<string>('');
  const [character, setCharacter] = useState<string[]>([]);
  const [tax, setTax] = useState<string>('');
  const [comboProducts, setComboProducts] = useState<Record<number, string[]>>(
    {},
  );
  const [singleComboProducts, setSingleComboProducts] =
    useState<ComboProductState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { files, setFiles, previewUrls } = useFileUpload(initialImageUrls);

  useQuery(GET_ALL_PRODUCT_LIST, {
    onCompleted: (res) => {
      const data = res.dropdown.data.map((ele: any) => ({
        label: ele.name,
        value: ele._id,
      }));
      setProductList(data);
    },
  });

  const [addComboProduct, { loading: adding }] = useMutation(
    ADD_COMBO_PRODUCT,
    {
      onCompleted: () => navigate('/combos'),
    },
  );

  const [updateComboProduct, { loading: updating }] = useMutation(
    UPDATE_COMBO_PRODUCT,
    {
      onCompleted: () => navigate('/combos'),
    },
  );

  const { data: getComboDetail } = useQuery(GET_COMBOS_DETAIL, {
    variables: { comboId: id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors, isDirty },
  } = useForm<ComboFormValues>({
    mode: 'onChange',
    resolver: yupResolver(comboSchema),
    defaultValues: {
      combos: [{ type: 'Single' }, { type: 'Single' }],
      extras: [],
    },
  });

  const { append, remove } = useFieldArray<ComboFormValues>({
    control,
    name: 'combos',
  });

  const watchPrice = watch('price', 0);
  const watchDiscount = watch('discount', 0);
  const finalPrice = useFinalPrice({
    price: watchPrice,
    discount: watchDiscount,
  });

  useEffect(() => {
    if (getComboDetail && getComboDetail?.combo?.data) {
      const productData = getComboDetail?.combo?.data;
      setInitialImageUrls(productData.imgUrl);
      const formData = productData.products.map(
        (product: {
          type: string;
          productId: any;
          title: any;
          options: any[];
        }) => ({
          type: product.type,
          product: product.type === 'Single' ? product.productId : null,
          comboTitle: product.title,
          options: product.options.map(
            (option: { productId: any; price: any }) => ({
              comboProduct: option.productId,
              comboProductPrice: option.price,
            }),
          ),
        }),
      );

      const comboProductsData = formData.reduce(
        (
          acc: { [x: string]: any },
          combo: { type: string; options: any[] },
          index: string | number,
        ) => {
          if (combo.type === 'Multiple') {
            acc[index] = combo.options.map((option) => option.comboProduct);
          }
          return acc;
        },
        {},
      );

      const singleComboProductsData = formData.reduce(
        (
          acc: { [x: string]: any },
          combo: { type: string; product: any },
          index: string | number,
        ) => {
          if (combo.type === 'Single') {
            acc[index] = combo.product;
          }
          return acc;
        },
        {},
      );

      setComboProducts(comboProductsData);
      setSingleComboProducts(singleComboProductsData);
      const transformedExtras = productData.extras.map(
        (extra: {
          groupName: string;
          isRequired: boolean;
          isMultiple: boolean;
          products: string[];
        }) => ({
          groupName: extra.groupName,
          isRequired: extra.isRequired,
          isMultiple: extra.isMultiple,
          products: extra.products,
        }),
      );
      const paymentTypeOptions =
        productData.availability?.map((value: string) => ({
          label: value,
          value: value,
        })) || [];
      const characterIds = productData.characteristicsDetail.map(
        (val: { _id: string }) => val._id,
      );
      const taxCode = productData.taxesDetail[0]._id;
      setCategory(productData?.categoryDetail?._id);
      setComboType(productData.type);
      setCharacter(characterIds);
      setTax(taxCode);
      reset({
        ...productData,
        extras: transformedExtras,
        categoryId: productData?.categoryDetail?._id,
        combos: formData,
        taxCode,
        price: productData.comboPrice,
        availability: paymentTypeOptions,
      });
    }
  }, [getComboDetail, reset]);

  const handleNextClick = async () => {
    const basicFields = [
      'categoryId',
      'name',
      'type',
      'calory',
      'code',
      'characteristicIds',
      'taxCode',
      'discount',
      'price',
      'availability',
      'combos',
    ];
    const isBasicValid = await trigger(basicFields);
    if (!isBasicValid) {
      goToStep('1');
      return false;
    }
    nextStep();
    return true;
  };

  const handleSingleProductChange = (index: number, value: any) => {
    setSingleComboProducts({
      ...singleComboProducts,
      [index]: value,
    });
  };

  const handleFinalSubmit = async (data: Record<string, unknown>) => {
    if (previewUrls.length === 0) {
      setError('files', {
        type: 'manual',
        message: t(ERROR_MESSAGES.UPLOAD_ONE_IMAGE),
      });
      goToStep('1');
      return;
    }
    clearErrors('files');
    setIsSubmitting(true);
    try {
      const deleted = initialImageUrls.filter(
        (url) => !previewUrls.includes(url),
      );
      if (deleted.length) {
        await deleteImages(deleted);
      }

      const newFiles = files.filter((f) => f.file instanceof File);
      const newUrls: string[] = newFiles.length
        ? await uploadImages({ files: newFiles })
        : [];

      const kept = previewUrls.filter((url) => initialImageUrls.includes(url));
      const allUrls = [...kept, ...newUrls];

      const availability = (
        data?.availability as Record<string, string>[]
      )?.map((val) => val.value);

      const products = (data.combos as Record<string, unknown>[]).map(
        (combo) => {
          if (combo.type === 'Single') {
            return {
              type: combo.type,
              productId: combo.product,
            };
          } else {
            // For Multiple, process options.
            const options = (combo.options as Record<string, unknown>[]).map(
              (option) => {
                const productNameList = productList.filter(
                  (p: Record<string, string>) =>
                    p.value === option.comboProduct,
                );
                return {
                  productId: option.comboProduct,
                  price: parseInt(option.comboProductPrice as string, 10),
                  name: productNameList[0]?.label,
                };
              },
            );
            return {
              type: combo.type,
              title: combo.comboTitle,
              options,
            };
          }
        },
      );

      const extras = (data?.extras as Record<string, string>[])?.map((val) => {
        return {
          groupName: val.groupName,
          isRequired: val.isRequired,
          isMultiple: val.isMultiple,
          products: val.products,
        };
      });

      const commonBody = {
        imgUrl: allUrls,
        finalPrice: finalPrice,
        categoryId: data.categoryId,
        availability,
      };

      const isValid = await trigger();

      let body = {};
      if (isValid) {
        delete data.availability;
        delete data.extras;
        delete data.nestedCombo;
        if (id) {
          delete data.characteristicsDetail;
          delete data.__typename;

          const id = data._id;
          delete data._id;
          body = {
            id,
            ...data,
            ...commonBody,
          };
          body = {
            characteristicIds: data.characteristicIds,
            code: data.code,
            calory: data.calory,
            comboPrice: data.price,
            discount: data.discount,
            description: data.description,
            finalPrice: commonBody.finalPrice
              ? commonBody.finalPrice
              : data.finalPrice,
            id: id,
            imgUrl: commonBody.imgUrl ? commonBody.imgUrl : allUrls,
            name: data.name,
            products: products,
            type: data.type,
            categoryId: data.categoryId,
            taxCode: data.taxCode,
            extras,
          };
          await updateComboProduct({ variables: { updateCombo: body } });
        } else {
          delete data.combos;
          delete data.files;
          body = {
            ...commonBody,
            extras,
            ...data,
            products,
            comboPrice: data.price,
          };
          delete (body as unknown as Record<string, unknown>).price;
          await addComboProduct({ variables: { data: body } });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComboProductChange = (
    comboIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const newComboProducts = { ...comboProducts };
    if (!newComboProducts[comboIndex]) {
      newComboProducts[comboIndex] = [];
    }
    newComboProducts[comboIndex][optionIndex] = value;
    setComboProducts(newComboProducts);
  };

  const comboDetails: ComboDetailsProps = {
    control: control,
    productList,
    watchCombos: watch('combos'),
    comboProducts,
    singleComboProducts,
    append,
    handleComboProductChange,
    handleSingleProductChange,
    onRemoveCombo: (comboIndex: number) => {
      remove(comboIndex);
    },
    errors,
  };

  const isFormChanged = isDirty || filesChanged;
  const submitting = adding || updating || isSubmitting;

  const basicDetails = (
    <BasicDetails
      combo
      control={control}
      errors={errors}
      category={category}
      character={character}
      finalPrice={finalPrice}
      handleNextClick={handleNextClick}
      setCategory={setCategory}
      setProductType={setComboType}
      productType={comboType}
      tax={tax}
      setCharacter={setCharacter}
      setTax={setTax}
      comboDetails={comboDetails}
    />
  );
  const extraDetails = (
    <form
      noValidate
      onSubmit={handleSubmit(handleFinalSubmit, () => goToStep('1'))}
    >
      <ExtraDetails<ComboFormValues>
        name="extras"
        control={control}
        errors={errors}
        isFormChanged={isFormChanged}
        isSubmitting={submitting}
      />
    </form>
  );

  return (
    <div>
      <Header
        title={`${id ? t('product.editCombo') : t('product.addCombo')}`}
      />
      <GridContainer columns={12}>
        <div
          data-item
          data-span={getNumberOfCols({ isDesktop, isMobile, mobileCol: 12 })}
        >
          <FileUploadSection
            files={files}
            setFiles={(f) => {
              setFiles(f);
              setFilesChanged(true);
            }}
            errorMessage={errors.files?.message as string}
            clearErrors={clearErrors}
            isMultiple
            setFilesChanged={setFilesChanged}
          />
        </div>
        <div
          data-item
          data-span={getNumberOfCols({
            isDesktop,
            isMobile,
            mobileCol: 12,
            desktopCol: 9,
          })}
        >
          <Card>
            <CommonTabs
              tabValue={tabValue}
              setTabValue={setTabValue}
              basicContent={basicDetails}
              extrasContent={extraDetails}
            />
          </Card>
        </div>
      </GridContainer>
    </div>
  );
};
