import {
  Tooltip as BasicTooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from '@mui/material';

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <BasicTooltip
    {...props}
    classes={{ popper: className }}
    enterTouchDelay={0}
    leaveTouchDelay={3000}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    border: `1px solid ${theme.palette.primary.main}`,
    padding: '8px 12px',
    ...theme.typography.body1,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#fff',
    '&::before': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
}));

Tooltip.displayName = 'Tooltip';
export default Tooltip;
