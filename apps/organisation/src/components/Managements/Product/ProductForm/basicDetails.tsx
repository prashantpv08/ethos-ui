import { FieldValues, Path, Controller } from 'react-hook-form';
import { Checkbox, Paragraph, PrimaryButton } from '@ethos-frontend/ui';
import {
  ControlledDropdown,
  ControlledInput,
  GridContainer,
} from '@ethos-frontend/components';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useDropdownData } from '@ethos-frontend/hook';
import { useParams } from 'react-router-dom';
import { API_URL, availableTimes, getProductType } from '@ethos-frontend/constants';
import { useUser } from '../../../../context/user';
import { ComboProductSelection } from '../Combos/comboProductsSelection';
import { IBasicDetails } from './formTypes';
import { useTranslation } from 'react-i18next';

export const BasicDetails = <T extends FieldValues>({
  control,
  errors,
  category,
  character,
  tax,
  finalPrice,
  handleNextClick,
  productType,
  setCategory,
  setProductType,
  setCharacter,
  setTax,
  combo,
  comboDetails,
}: IBasicDetails<T>) => {
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useResponsive();
  const { id } = useParams();
  const { userData } = useUser();
  const getAvailableTime = availableTimes()

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    refetch: fetchCategoryData,
  } = useDropdownData(
    'categoryDropdown',
    API_URL.categoryDropdown,
    (data) =>
      data
        ?.filter((val: { category_type: string }) =>
          combo
            ? val.category_type === 'combo'
            : val.category_type === 'default',
        )
        .map((val: { _id: string; name: string }) => ({
          value: val._id,
          label: val.name,
        })),
    { enabled: !!id },
  );

  const {
    data: characterData,
    isLoading: isCharacteristicsLoading,
    refetch: fetchCharacteristicsData,
  } = useDropdownData(
    'charactersticsDropdown',
    API_URL.characteristicDropdown,
    (data) =>
      data?.map((val: { _id: string; name: string }) => ({
        value: val._id,
        label: val.name,
      })),
    { enabled: !!id },
  );

  const {
    data: taxData,
    isLoading: isTaxLoading,
    refetch: fetchTaxData,
  } = useDropdownData(
    'taxDropdown',
    API_URL.taxDropdown,
    (data) =>
      data?.map((val: { _id: string; code: string }) => ({
        value: val._id,
        label: val.code,
      })),
    { enabled: !!id },
  );

  // Handlers to fetch data on dropdown open if not loaded
  const fetchCategory = () => {
    if (categoryData.length === 0) {
      fetchCategoryData();
    }
  };

  const fetchCharacters = () => {
    if (characterData.length === 0) {
      fetchCharacteristicsData();
    }
  };

  const fetchTax = () => {
    if (taxData.length === 0) {
      fetchTaxData();
    }
  };

  const getProductTypes = getProductType();

  return (
    <form noValidate>
      <GridContainer columns={12}>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledDropdown
            name="categoryId"
            control={control}
            placeholder={t('product.selectCategory')}
            options={categoryData || []}
            errors={errors}
            helperText={errors}
            onChange={(value: string | string[]) =>
              setCategory(value as unknown as string)
            }
            value={category}
            onOpen={fetchCategory}
            loading={isCategoryLoading}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledInput
            type="text"
            name="name"
            control={control}
            required
            fullWidth
            label={combo ? t('product.comboName') : t('product.productName')}
            errors={errors}
            helperText={errors}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledDropdown
            name="type"
            control={control}
            placeholder={combo ? t('product.comboType') : t('product.productType')}
            options={getProductTypes}
            errors={errors}
            helperText={errors}
            onChange={(value: string | string[]) =>
              setProductType(value as unknown as string)
            }
            value={productType}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledInput
            type="number"
            name="calory"
            label={t('product.totalCalories')}
            control={control}
            required
            fullWidth
            rightIcon="cal"
            errors={errors}
            helperText={errors}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledInput
            type="text"
            name="code"
            label={combo ? t('product.comboCode') : t('product.productCode')}
            control={control}
            required
            fullWidth
            errors={errors}
            helperText={errors}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledDropdown
            name="characteristicIds"
            errors={errors}
            control={control}
            placeholder={t('product.selectCharacter')}
            options={characterData}
            multiple
            helperText={errors}
            onChange={(value: string | string[]) =>
              setCharacter(value as unknown as string[])
            }
            value={character}
            onOpen={fetchCharacters}
            loading={isCharacteristicsLoading}
          />
        </div>

        <div data-span={4} data-item>
          <ControlledDropdown
            name="taxCode"
            errors={errors}
            control={control}
            placeholder={t('tax.code')}
            options={taxData}
            helperText={errors}
            onChange={(value: string | string[]) =>
              setTax(value as unknown as string)
            }
            value={tax}
            onOpen={fetchTax}
            loading={isTaxLoading}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledInput
            type="number"
            name="price"
            label={combo ? t('product.comboPrice') : t('product.productPrice')}
            control={control}
            required
            leftIcon={userData?.currency?.symbol}
            fullWidth
            errors={errors}
            helperText={errors}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
        >
          <ControlledInput
            type="number"
            name="discount"
            label={t('product.discount')}
            control={control}
            required
            leftIcon={userData?.currency?.symbol}
            errors={errors}
            fullWidth
            helperText={errors}
          />
        </div>

        <div data-span={12} data-item>
          <ControlledInput
            type="text"
            name="description"
            label={t('product.description')}
            control={control}
            required
            multiline
            rows={5}
            fullWidth
            errors={errors}
            helperText={errors}
          />
        </div>
        <div
          data-span={getNumberOfCols({ isDesktop, isMobile, desktopCol: 4 })}
          data-item
          className="place-content-center"
        >
          <Paragraph variant="subtitle1" weight="semibold">
            {t('product.finalPrice')}: {finalPrice}
            {userData?.currency?.symbol}
          </Paragraph>
        </div>
        <div data-span={12} data-item>
          <Controller
            name={`availability` as Path<T>}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Checkbox
                  label={t('product.availableTimes')}
                  variant="custom"
                  align="horizontal"
                  selectedValues={value}
                  onGroupChange={(e) => onChange(e)}
                  options={getAvailableTime}
                />
                {error && <p className="error">{error.message}</p>}
              </>
            )}
          />
        </div>
      </GridContainer>
      {combo && comboDetails && <ComboProductSelection {...comboDetails} />}
      <div className="flex pt-5 justify-end">
        <PrimaryButton onClick={handleNextClick}>{t('next')}</PrimaryButton>
      </div>
    </form>
  );
};
