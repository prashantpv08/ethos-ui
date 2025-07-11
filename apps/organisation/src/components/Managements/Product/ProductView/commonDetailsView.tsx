import { useMemo } from 'react';
import { Heading, Label, Table } from '@ethos-frontend/ui';
import { Card, GridContainer } from '@ethos-frontend/components';
import Slider from 'react-slick';
import { useResponsive, getNumberOfCols } from '@ethos-frontend/utils';
import styles from './productView.module.scss';
import { Header, ItemsDetail } from '../../../Common';

export interface DetailField {
  span: number;
  label: string;
  description: string;
}

export interface ExtraGroup {
  groupName: string;
  isRequired: boolean;
  isMultiple: boolean;
  products: Array<{
    id: string;
    name: string;
    type: string;
    price: number;
    status: string;
  }>;
}

export interface CommonDetailViewProps {
  title: string;
  basicFields: DetailField[];
  imgUrls: string[];
  extras: ExtraGroup[];
}

const extrasColumns = [
  { field: 'name', headerName: 'Product', flex: 1 },
  { field: 'type', headerName: 'Type', flex: 1 },
  { field: 'price', headerName: 'Price', flex: 1 },
  { field: 'status', headerName: 'Status', minWidth: 50 },
];

export const CommonDetailView = ({
  title,
  basicFields,
  imgUrls,
  extras,
}: CommonDetailViewProps) => {
  const { isMobile, isDesktop } = useResponsive();

  const sliderSettings = useMemo(
    () => ({
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      adaptiveHeight: false,
      centerMode: true,
      centerPadding: '0px',
      customPaging: (i: number) => (
        <img
          src={imgUrls[i]}
          alt={`thumb-${i}`}
          style={{ width: 80, height: 50, objectFit: 'cover' }}
        />
      ),
      className: `${styles.customSize}`,
      dotsClass: 'slick-dots slick-thumb',
    }),
    [imgUrls],
  );

  return (
    <>
      <Header title={title} />
      <GridContainer
        columns={getNumberOfCols({ isMobile, isDesktop, desktopCol: 12 })}
        className="pt-4"
      >
        <div
          data-item
          data-span={getNumberOfCols({ isMobile, isDesktop, desktopCol: 8 })}
        >
          <ItemsDetail details={basicFields} columns={12} />
        </div>

        <div
          data-item
          data-span={getNumberOfCols({ isMobile, isDesktop, desktopCol: 4 })}
        >
          <Card>
            {imgUrls.length > 1 ? (
              <Slider {...sliderSettings}>
                {imgUrls.map((url, i) => (
                  <div key={i} className={styles.slide}>
                    <img src={url} alt={`${title} ${i + 1}`} />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className={styles.slide}>
                <img src={imgUrls[0]} alt={title} />
              </div>
            )}
          </Card>
        </div>
      </GridContainer>

      <GridContainer
        columns={getNumberOfCols({ isMobile, isDesktop, desktopCol: 6 })}
        className="pt-8"
      >
        {extras.map((grp, idx) => {
          const rows = grp.products.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            price: `$${p.price.toFixed(2)}`,
            status: p.status,
          }));

          return (
            <div
              key={idx}
              data-item
              data-span={getNumberOfCols({
                isMobile,
                isDesktop,
                desktopCol: 12,
              })}
            >
              <Card>
                <Heading variant="h5" weight="bold">
                  Extras · {grp.groupName}
                </Heading>
                <Label variant="subtitle2">
                  Required: {grp.isRequired ? 'Yes' : 'No'} &nbsp;|&nbsp;
                  Multiple: {grp.isMultiple ? 'Yes' : 'No'}
                </Label>
                <Table columns={extrasColumns} rows={rows} hideFooter />
              </Card>
            </div>
          );
        })}
      </GridContainer>
    </>
  );
};
