import React from 'react';
import {
  Stepper as BasicStepper,
  Step,
  StepLabel,
  StepperProps,
  styled,
} from '@mui/material';
import { Paragraph } from '../typography';

interface IStep {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface CustomStepperProps extends StepperProps {
  steps: IStep[];
  activeStep: number;
}

const StepLabelStyled = styled(StepLabel)<{ isCompleted: boolean }>(
  ({ isCompleted, theme }) => ({
    '& .MuiStepLabel-label': {
      color: isCompleted ? theme.palette.success.main : undefined,
      // fontWeight: isCompleted ? 'bold' : 'normal',
    },
  })
);

const StepStyled = styled(Step)<{ isActive: boolean }>(
  ({ isActive, theme }) => ({
    transition: 'transform 0.5s ease',
    '& .MuiStepLabel-iconContainer': {
      '& svg': {
        width: 22,
        border: isActive ? '2px solid #1259FF' : '2px solid #96b6ff',
        height: 22,
        padding: 2,
        borderRadius: '50%',
        boxShadow: '0px 0px 1px 1px #0000001a',
        transition: 'color 0.5s ease',
        animation: isActive ? `pulse-animation 2s infinite` : 'none',
        background: isActive ? '96b6ff' : 'none',
        '& text': {
          display: 'none',
        },
      },
    },

    '& .MuiStepLabel-label': {
      ...theme.typography.subtitle2,
    },

    '@keyframes pulse-animation': {
      '0%': {
        boxShadow: '0 0 0 0px rgba(0, 0, 0, 0.2)',
      },
      '100%': {
        boxShadow: '0 0 0 20px rgba(0, 0, 0, 0)',
      },
    },
  })
);

const StyledStepper = styled(BasicStepper)<{ orientation: string }>(
  ({ orientation }) => ({
    '& .MuiStepConnector-root': {
      marginLeft: orientation === 'vertical' ? 10 : 0,
    },
    '& .MuiStepConnector-line': {
      minHeight: orientation === 'vertical' ? '54px' : 'auto',
    },
  })
);

const Stepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  ...rest
}) => {
  return (
    <StyledStepper activeStep={activeStep} orientation={orientation} {...rest}>
      {steps.map((step, index) => (
        <StepStyled key={index} isActive={index === activeStep}>
          <StepLabelStyled isCompleted={index < activeStep}>
            {step.label}
            {step.description && (
              <Paragraph variant="body1" sx={{ marginTop: 0.5 }}>
                {step.description}
              </Paragraph>
            )}
          </StepLabelStyled>
        </StepStyled>
      ))}
    </StyledStepper>
  );
};

Stepper.displayName = 'Stepper';

export default Stepper;
