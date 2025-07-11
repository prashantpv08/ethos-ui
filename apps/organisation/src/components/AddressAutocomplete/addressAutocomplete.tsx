import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { ControlledInput } from '@ethos-frontend/components';
import { Autocomplete } from '@react-google-maps/api';

interface AddressAutocompleteProps {
  control: any;
  errors: any;
  onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
}

export const AddressAutocomplete = forwardRef<
  google.maps.places.Autocomplete | null,
  AddressAutocompleteProps
>(({ control, errors, onPlaceChanged }, ref) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Expose autocompleteRef to parent component
  useImperativeHandle(
    ref,
    () => autocompleteRef.current as google.maps.places.Autocomplete,
    []
  );

  return (
    <Autocomplete
      onLoad={(autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
        if (typeof ref === 'function') {
          ref(autocomplete);
        } else if (ref && 'current' in ref) {
          ref.current = autocomplete;
        }
      }}
      onPlaceChanged={() => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          onPlaceChanged(place);
        }
      }}
    >
      <ControlledInput
        type="text"
        name="address"
        label="Address"
        control={control}
        required
        errors={errors}
        helperText={errors}
        fullWidth
      />
    </Autocomplete>
  );
});

AddressAutocomplete.displayName = 'AddressAutocomplete';
