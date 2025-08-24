import { useEffect, useState } from "react";
import {
  Dailog as Dialog,
  AutoComplete,
  Select,
  TextField,
} from "@ethos-frontend/ui";
import { useRestMutation, useRestQuery } from "@ethos-frontend/hook";
import { API_URL } from "@ethos-frontend/constants";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Option {
  value: string;
  label: string;
}

interface FormValues {
  orgIds: Option[];
  commissionType: string;
  commissionValue: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const schema = yup.object({
  orgIds: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
    )
    .min(1, "Organisation is required")
    .required(),
  commissionType: yup.string().required("Commission type is required"),
  commissionValue: yup.string().required("Commission value is required"),
});

export default function CommissionDialog({ open, onClose, onSaved }: Props) {
  const [orgOptions, setOrgOptions] = useState<Option[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      orgIds: [],
      commissionType: "",
      commissionValue: "",
    },
    mode: "onChange",
  });

  const { data: orgData } = useRestQuery<any>(
    "active-orgs",
    API_URL.activeOrg,
    { enabled: open }
  );

  useEffect(() => {
    if (orgData?.data) {
      const opts = orgData.data.map((o: any) => ({
        value: o._id,
        label: o.orgName,
      }));
      setOrgOptions(opts);
    }
  }, [orgData]);

  const { mutate: saveCommission } = useRestMutation(API_URL.updateCommission, {
    method: "PATCH",
  });

  const onSubmit = (data: FormValues) => {
    saveCommission(
      {
        orgIds: data.orgIds.map((o) => o.value),
        commissionType: data.commissionType,
        commissionValue: data.commissionValue,
      },
      {
        onSuccess: () => {
          onClose();
          onSaved();
          reset();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onCancel={() => {
        onClose();
        reset();
      }}
      onConfirm={handleSubmit(onSubmit)}
      title="Add Commission"
      confirmText="Save"
      cancelText="Cancel"
      size="md"
      confirmDisabled={!isValid}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="orgIds"
          control={control}
          render={({ field }) => (
            <AutoComplete
              fullWidth
              label="Select Organisations"
              options={orgOptions}
              value={field.value}
              multiple
              onChange={(e, val) => field.onChange(val as Option[])}
              error={!!errors.orgIds}
              helperText={errors.orgIds?.message as string}
            />
          )}
        />
        <Controller
          name="commissionType"
          control={control}
          render={({ field }) => (
            <Select
              label="Commission Type"
              items={[
                { value: "Flat", label: "Flat" },
                { value: "Percentage", label: "Percentage" },
              ]}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value as string)}
              error={!!errors.commissionType}
              helperText={errors.commissionType?.message}
            />
          )}
        />
        <Controller
          name="commissionValue"
          control={control}
          render={({ field }) => (
            <TextField
              label="Commission Value"
              type="number"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              error={!!errors.commissionValue}
              helperText={errors.commissionValue?.message}
            />
          )}
        />
      </div>
    </Dialog>
  );
}
