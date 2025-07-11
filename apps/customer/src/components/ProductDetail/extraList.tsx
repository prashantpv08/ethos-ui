import React from 'react';
import { Checkbox, Radio, Label, Iconbutton } from '@ethos-frontend/ui';
import { priceWithSymbol } from '@ethos-frontend/utils';
import styles from './productDetail.module.scss';
import { IExtras, ISelectedValues } from '../../types/product';

interface ExtrasListProps {
  extras: IExtras[];
  selectedValues: ISelectedValues[];
  handleRadioChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    groupName: string,
    _id: string
  ) => void;
  handleCheckboxChange: (
    newSelectedValues: ISelectedValues[],
    groupName: string
  ) => void;
}

export const ExtrasList: React.FC<ExtrasListProps> = ({
  extras,
  selectedValues,
  handleRadioChange,
  handleCheckboxChange,
}) => {
  return (
    <>
      {extras.map((extra) => (
        <div className={styles.foodTopup} key={extra._id}>
          <div>
            <div className={styles.radioHeader}>
              <Label variant="h5">{extra.groupName}</Label>
              {extra.isRequired && (
                <Iconbutton
                  className="!p-0"
                  name="check"
                  text="Required"
                  textColor="#00ab53"
                />
              )}
            </div>
            {extra.isMultiple ? (
              <Checkbox
                variant="group"
                selectedValues={selectedValues.filter(
                  (val) => val.groupName === extra.groupName
                )}
                onGroupChange={(newSelectedValues) =>
                  handleCheckboxChange(
                    newSelectedValues.map((val) => ({
                      ...val,
                      groupName: extra.groupName,
                      _id: extra._id,
                    })),
                    extra.groupName
                  )
                }
                options={extra?.products?.map((product) => ({
                  label: product?.name as string,
                  value: product?._id as unknown as string,
                  price: product?.price,
                  priceWithSymbol: product?.price
                    ? priceWithSymbol(product?.price)
                    : undefined,
                }))}
              />
            ) : (
              <Radio
                name={extra.groupName}
                value={
                  selectedValues.find(
                    (val) => val.groupName === extra.groupName
                  )?.value || ''
                }
                onChange={(e) =>
                  handleRadioChange(e, extra.groupName, extra._id)
                }
                options={extra?.products?.map((product) => ({
                  label: product?.name,
                  value: product?._id as unknown as string,
                  price: (product?.price
                    ? priceWithSymbol(product?.price)
                    : undefined) as unknown as number,
                }))}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
};
