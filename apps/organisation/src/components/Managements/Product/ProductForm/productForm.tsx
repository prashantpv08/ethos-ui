import { useState, useEffect } from 'react';
import { Header } from '../../../Common';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { BasicDetails } from './basicDetails';
import { uploadImages } from '../../../../utils/uploadImage';
import { GridContainer, Card } from '@ethos-frontend/components';
import {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
} from '@organisation/api/mutations/ProductManagement';
import { GET_PRODUCT_DETAIL } from '@organisation/api/queries/ProductManagement';
import { ExtraDetails } from './extraDetails';
import { useFileUpload, useFinalPrice, useStepForm } from '../../../../hooks';
import { productSchema } from './validationSchema';
import { ProductFormValues } from './formTypes';
import { FileUploadSection } from '../../../Common/FileUploadSection/fileUploadSection';
import { CommonTabs } from './commonTabs';
import { deleteImages } from '../../../../utils/deleteImage';
import { useTranslation } from 'react-i18next';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';

export const ProductForm = () => {
  const {t} = useTranslation();
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

  const [category, setCategory] = useState<string>('');
  const [productType, setProductType] = useState<string>('');
  const [character, setCharacter] = useState<string[]>([]);
  const [tax, setTax] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { files, setFiles, previewUrls } = useFileUpload(initialImageUrls);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    mode: 'all',
    resolver: yupResolver(productSchema),
    defaultValues: {
      extras: [],
    },
  });

  const watchPrice = watch('price', 0);
  const watchDiscount = watch('discount', 0);

  // Use custom hook to calculate final price
  const finalPrice = useFinalPrice({
    price: watchPrice,
    discount: watchDiscount,
  });

  // GraphQL API hooks
  const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => {
      navigate('/product');
    },
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      navigate('/product');
    },
  });

  const { data: getProductDetail } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { productId: id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (getProductDetail && getProductDetail?.product?.data) {
      const productData = getProductDetail?.product?.data;
      const characterIds = productData?.characteristicsDetail?.map(
        (val: { _id: string }) => val._id,
      );
      const paymentTypeOptions =
        productData.availability?.map((value: string) => ({
          label: value,
          value: value,
        })) || [];
      const categoryId = productData?.categoryDetail?._id;
      const taxCode = productData.taxesDetail[0]._id;
      setCategory(categoryId);
      setProductType(productData.type);
      setCharacter(characterIds);
      setTax(taxCode);

      reset({
        ...productData,
        categoryId,
        characteristicIds: characterIds,
        taxCode,
        availability: paymentTypeOptions,
      });
      setInitialImageUrls(productData.imgUrl);
    }
  }, [getProductDetail, reset]);

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
    ];
    const isBasicValid = await trigger(basicFields);
    if (!isBasicValid) {
      goToStep('1');
      return false;
    }
    nextStep();
    return true;
  };

  const handleFinalSubmit = async (data: Record<string, unknown>) => {
    if (files.length === 0) {
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

      const availability = (data.availability as { value: string }[])?.map(
        (val) => val.value,
      );

      const commonBody = {
        imgUrl: allUrls,
        finalPrice,
        availability,
      };
      const isFormValid = await trigger();

      delete data.availability;
      delete data.files;
      const rawExtras = data.extras ?? [];
      const extras = (rawExtras as Record<string, string>[])
        .filter(
          (e) => e.groupName.trim() !== '' || (e.products?.length ?? 0) > 0,
        )
        ?.map((val) => {
          return {
            groupName: val.groupName,
            isRequired: val.isRequired,
            isMultiple: val.isMultiple,
            products: val.products,
          };
        });
      delete data.extras;
      if (isFormValid) {
        if (id) {
          delete data.categoryDetail;
          delete data.characteristicsDetail;
          delete data.taxesDetail;
          delete data.__typename;
          delete data.extrasProducts;
          const productId = data._id;
          delete data._id;
          const payload = {
            extras,
            id: productId,
            ...data,
            ...commonBody,
          };

          await updateProduct({ variables: { data: payload } });
        } else {
          const body = {
            extras,
            ...commonBody,
            ...data,
          };
          await addProduct({ variables: { data: body } });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormChanged = isDirty || filesChanged;
  const submitting = adding || updating || isSubmitting;

  const basicDetails = (
    <BasicDetails
      control={control}
      errors={errors}
      category={category}
      character={character}
      finalPrice={finalPrice}
      handleNextClick={handleNextClick}
      setCategory={setCategory}
      setProductType={setProductType}
      productType={productType}
      tax={tax}
      setCharacter={setCharacter}
      setTax={setTax}
    />
  );

  const extraDetails = (
    <form
      noValidate
      onSubmit={handleSubmit(handleFinalSubmit, () => goToStep('1'))}
    >
      <ExtraDetails<ProductFormValues>
        name="extras"
        isFormChanged={isFormChanged}
        control={control}
        errors={errors}
        isSubmitting={submitting}
      />
    </form>
  );

  return (
    <div>
      <Header title={`${id ? t('product.editProduct') : t('product.addProduct')}`} />
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
