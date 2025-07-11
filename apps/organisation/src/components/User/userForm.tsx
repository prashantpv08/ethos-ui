import { ControlledInput, GridContainer } from '@ethos-frontend/components';
import {
  Control,
  Controller,
  FieldValues,
  UseFormHandleSubmit,
  Path,
  FieldErrors,
} from 'react-hook-form';
import { Checkbox, Label, PrimaryButton, Switch } from '@ethos-frontend/ui';
import { MODULE_PAGES, moduleWithPages } from '../../constants';
import { useMutation } from '@apollo/client';
import {
  CREATE_USER,
  UPDATE_USER,
} from '@organisation/api/mutations/UserManagement';
import { GET_EMPLOYEE_LIST } from '@organisation/api/queries/UserManagement';
import { toast } from 'react-toastify';

interface IUserForm<T extends FieldValues> {
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  errors: FieldErrors<T>;
  setUserFormModal: (value: boolean) => void;
  editForm: boolean;
  selectedModules: { [key: string]: string[] };
  setSelectedModules: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] }>
  >;
  onModalClose: () => void;
}

export const UserForm = <T extends FieldValues>({
  control,
  handleSubmit,
  errors,
  setUserFormModal,
  editForm,
  selectedModules,
  setSelectedModules,
  onModalClose,
}: IUserForm<T>) => {
  const handleCheckboxChange = (
    module: string,
    selectedValues: string[],
    onChange: (value: { [key: string]: string[] }) => void
  ) => {
    const newSelectedModules: { [key: string]: string[] } = {
      ...selectedModules,
    };

    if (
      selectedValues.includes(MODULE_PAGES.ADD) ||
      selectedValues.includes(MODULE_PAGES.EDIT) ||
      selectedValues.includes(MODULE_PAGES.DELETE)
    ) {
      if (!selectedValues.includes(MODULE_PAGES.LIST)) {
        selectedValues.push(MODULE_PAGES.LIST);
      }
    }

    if (selectedValues.length > 0) {
      newSelectedModules[module] = selectedValues;
    } else {
      delete newSelectedModules[module];
    }

    // return newSelectedModules;
    setSelectedModules(newSelectedModules);
    onChange(newSelectedModules);
  };

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  const onSubmit = (data: {
    access?: { [key: string]: string[] };
    role?: string;
    fullName?: string;
    status?: string | boolean;
    id?: string;
  }) => {
    const accessPayload = Object.entries(selectedModules).map(
      ([module, pages]) => ({
        module,
        pages,
      })
    );
    delete data.access;
    delete data.role;
    delete data.fullName;

    const payload = {
      ...data,
      access: accessPayload,
    };

    if (editForm) {
      payload.status = data.status === true ? 'active' : 'deleted';
      updateUser({
        variables: { params: { ...payload } },
        refetchQueries: [GET_EMPLOYEE_LIST],
      })
        .then((res) => {
          const employeeData = res.data.updateEmployee.data;
          setUserFormModal(false);
          toast.success(
            `${employeeData.firstName} ${employeeData.lastName} has been updated!`
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      delete payload.status;
      delete payload.id;
      createUser({
        variables: { params: { ...payload } },
        refetchQueries: [GET_EMPLOYEE_LIST],
      })
        .then((res) => {
          const employeeData = res.data.createEmployee.data;
          setUserFormModal(false);
          toast.success(
            `${employeeData.firstName} ${employeeData.lastName} has been added!`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <GridContainer columns={12}>
        <div data-item data-span={6}>
          <ControlledInput
            name={'firstName' as Path<T>}
            type="text"
            control={control}
            fullWidth
            required
            label="First Name"
            errors={errors}
            helperText={errors}
          />
        </div>
        <div data-item data-span={6}>
          <ControlledInput
            name={'lastName' as Path<T>}
            type="text"
            control={control}
            fullWidth
            required
            label="Last Name"
            errors={errors}
            helperText={errors}
          />
        </div>

        <div data-item data-span={6}>
          <ControlledInput
            name={'email' as Path<T>}
            type="email"
            fullWidth
            required
            control={control}
            label="Email"
            errors={errors}
            helperText={errors}
          />
        </div>
        {editForm ? (
          <div data-item data-span={6}>
            <Controller
              name={'status' as Path<T>}
              control={control}
              render={({ field }) => (
                <Switch label="Active" {...field} checked={field.value} />
              )}
            />
          </div>
        ) : null}
      </GridContainer>
      <GridContainer columns={12} className="py-5">
        <Label data-item data-span={12} variant="subtitle1" weight="semibold">
          Select Modules for access
        </Label>
        {moduleWithPages.map((module) => (
          <div data-item data-span={4} key={module.key}>
            <Controller
              name={`access` as Path<T>}
              control={control}
              render={({ field: { onChange } }) => (
                <Checkbox
                  variant="group"
                  label={module.label}
                  options={module.pages.map((page) => ({
                    label: page.charAt(0).toUpperCase() + page.slice(1),
                    value: page,
                    disabled:
                      page === MODULE_PAGES.LIST &&
                      selectedModules[module.key]?.length > 1,
                  }))}
                  align="horizontal"
                  onGroupChange={(selectedOptions) => {
                    handleCheckboxChange(
                      module.key,
                      selectedOptions.map((option) => option.value),
                      onChange
                    );
                  }}
                  selectedValues={
                    selectedModules[module.key]?.map((page) => ({
                      label: page,
                      value: page,
                    })) || []
                  }
                />
              )}
            />
          </div>
        ))}

        {errors?.access && (
          <p data-item data-span={12} className="error">
            {errors?.access?.message as string}
          </p>
        )}
      </GridContainer>
      <div className="flex justify-end gap-4">
        <PrimaryButton variant="text" onClick={onModalClose}>
          Cancel
        </PrimaryButton>
        <PrimaryButton type="submit">
          {editForm ? 'Update' : 'Add'} User
        </PrimaryButton>
      </div>
    </form>
  );
};
