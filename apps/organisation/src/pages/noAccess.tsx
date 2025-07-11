import { PrimaryButton } from '@ethos-frontend/ui';
import { useNavigate } from 'react-router-dom';

export const NoAccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center flex-col gap-3 absolute top-0 h-full w-full mx-auto">
      You are not authorized to access this page.
      <PrimaryButton
        onClick={() => {
          navigate('/');
        }}
      >
        Back to Home Page
      </PrimaryButton>
    </div>
  );
};
