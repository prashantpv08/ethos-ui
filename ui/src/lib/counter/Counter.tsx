import Box from '@mui/material/Box';
import { Iconbutton } from '../iconButton';
import { styled } from '@mui/material';
import { TextField } from '../textfield';

const StyledInput = styled(TextField)(() => ({
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-input': {
    width: '34px',
    padding: 0,
    textAlign: 'center',
  },
}));

const StyledIconbutton = styled(Iconbutton)(() => ({
  '&.MuiButtonBase-root': {
    padding: '0 3px',
    width: 28,
    minHeight: 28,
    fontSize: 18,
  },
}));

const StyledBox = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid #E6E6E6',
  borderRadius: '4px',
  padding: '2px',
}));

export interface ICounter {
  count: number;
  setCount?: (value: number | ((prevValue: number) => number)) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const Counter = ({
  count = 0,
  setCount,
  onIncrement,
  onDecrement,
}: ICounter) => {
  const incrementCount = () => {
    if (!onIncrement) {
      setCount?.((prevCount: number) => prevCount + 1);
    }
    onIncrement?.();
  };

  const decrementCount = () => {
    if (!onDecrement) {
      setCount?.((prevCount: number) => prevCount - 1);
    }
    onDecrement?.();
  };

  return (
    <StyledBox>
      <StyledIconbutton
        name="line"
        variant="secondary"
        disabled={count === 0}
        onClick={() => decrementCount()}
      />
      <StyledInput
        inputProps={{
          readOnly: true,
        }}
        value={count}
      ></StyledInput>
      <StyledIconbutton
        name="expand"
        variant="secondary"
        onClick={() => incrementCount()}
      />
    </StyledBox>
  );
};

Counter.displayName = 'Counter';
export default Counter;
