import { useState } from 'react';
import { Card, GridContainer } from '@ethos-frontend/components';
import { PrimaryButton } from '@ethos-frontend/ui';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import { API_METHODS, API_URL, themeColors } from '@ethos-frontend/constants';
import { toast } from 'react-toastify';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useUser } from '../../context/user';
import { useTranslation } from 'react-i18next';

export const Theme = () => {
  const { isDesktop, isMobile } = useResponsive();
  const {t} = useTranslation();
  const { userData } = useUser();
  const getThemeColors = themeColors();
  const [selectedColor, setSelectedColor] = useState<
    | {
        name: string;
        image: string;
        id: number;
        background: string;
        code: string;
      }
    | undefined
  >({
    name: '',
    image: '',
    id: 0,
    background: '',
    code: '',
  });
  useRestQuery('fetch-theme', API_URL.app, {
    enabled: Boolean(userData),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    onSuccess: (resp) => {
      const selectedOption = getThemeColors.find(
        (val) => val.name === resp.data?.data?.colorCode,
      );

      setSelectedColor(selectedOption);
    },
  });

  const { mutate, isPending } = useRestMutation(
    API_URL.app,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        toast.success('Theme added successfully!');
      },
      onError: () => {
        toast.error('Failed to update theme!');
      },
    },
  );

  const handleSave = () => {
    if (selectedColor) {
      mutate({
        colorCode: selectedColor.name,
        background: selectedColor.image,
      });
    } else {
      toast.error('Please select a theme!');
    }
  };

  return (
    <div>
      <Card title={t('account.preferenceTab.themeOptions')}>
        <GridContainer columns={12} className="gap-4">
          {getThemeColors.map((color) => (
            <div
              key={color.id}
              data-item
              data-span={getNumberOfCols({
                isDesktop,
                isMobile,
                desktopCol: 4,
                mobileCol: 6,
              })}
              style={{
                backgroundImage: `url(${color.image})`,
                backgroundSize: 'cover',
                border:
                  selectedColor?.id === color.id
                    ? '2px solid var(--primary)'
                    : 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              className="h-32 flex items-center justify-center"
              onClick={() => setSelectedColor(color)}
            >
              <div
                style={{
                  backgroundColor: color.background,
                  color: color.code,
                  padding: '8px',
                  borderRadius: '4px',
                  textAlign: 'center',
                }}
              >
                {color.name}
              </div>
            </div>
          ))}
        </GridContainer>
        <div className="flex justify-end mt-5">
          <PrimaryButton
            onClick={handleSave}
            loading={isPending}
            disabled={!selectedColor}
          >
            {t('account.preferenceTab.saveTheme')}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};
