import React, { useEffect, useState } from 'react';
import { Dailog as Dialog, AutoComplete, Select, TextField } from '@ethos-frontend/ui';
import { getActiveOrgList, updateCommission } from '../Pages/Organisation/action';

interface Option {
  value: string;
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CommissionDialog({ open, onClose, onSaved }: Props) {
  const [orgOptions, setOrgOptions] = useState<Option[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<Option[]>([]);
  const [type, setType] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open) {
      getActiveOrgList((data: any[]) => {
        const opts = (data || []).map((o: any) => ({
          value: o._id,
          label: o.orgName,
        }));
        setOrgOptions(opts);
      });
    }
  }, [open]);

  const handleConfirm = () => {
    updateCommission(
      {
        orgIds: selectedOrgs.map((o) => o.value),
        commissionType: type,
        commissionValue: value,
      },
      () => {
        onClose();
        onSaved();
        setSelectedOrgs([]);
        setType('');
        setValue('');
      },
    );
  };

  return (
    <Dialog
      open={open}
      onCancel={() => {
        onClose();
        setSelectedOrgs([]);
        setType('');
        setValue('');
      }}
      onConfirm={handleConfirm}
      title="Add Commission"
      confirmText="Save"
      cancelText="Cancel"
      size="md"
    >
      <div className="flex flex-col gap-4">
        <AutoComplete
          label="Select Organisations"
          options={orgOptions}
          value={selectedOrgs}
          multiple
          onChange={(e, val) => setSelectedOrgs(val as Option[])}
        />
        <Select
          label="Commission Type"
          value={type}
          onChange={(e) => setType(e.target.value as string)}
          items={[
            { value: 'Flat', label: 'Flat' },
            { value: 'Percentage', label: 'Percentage' },
          ]}
        />
        <TextField
          label="Commission Value"
          type="number"
          name="commissionValue"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Dialog>
  );
}
